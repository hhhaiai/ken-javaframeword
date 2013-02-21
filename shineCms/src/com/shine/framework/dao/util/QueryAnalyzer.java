package com.shine.framework.dao.util;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.shine.framework.entity.BaseEntity;
import com.shine.framework.exception.DataAccessException;
import com.shine.platform.logger.LoggerFactory;

/**
 * HQL查询分析器<br/>
 * 智能解析查询条件、排序等,当有需关联查询时则增加关联查询语句（使用多层次的关联查询将消耗更大性能）
 * @author JiangKunpeng	2011.05.06
 * @version 2013.02.21
 */
public class QueryAnalyzer {
	private List<QuerySorter> sorters = new ArrayList<QuerySorter>();	//查询排序集合
	private List<QueryItem> items = new ArrayList<QueryItem>();	//查询条件集合
	private String baseSQL;		//基本查询HQL,如果没设置则通过clazz自动生成;如：from entityName where 1=1
	private BaseEntity entity;	//要查询的实体类 实例
	private Class clazz;		//生成基本HQL的Class
	private Pagination page;	//分页实体
	private int joinIndex = 0;	//关联查询别名计数器
	private String entityAlias = null;	//HQL中的实体别名,自定义baseSQL时需指定
	
	/**
	 * 存放关联查询信息,自动生成baseSQL时才有用
	 * 键：关联字段原始HQL语句,如：roles.roleId
	 * 值：字符数组[关联实体别名,关联语句值],如：[_E1,entityAlias.roles]、[_E2,roles.menus]
	 */
	Map<String, String[]> joinMap = new HashMap<String, String[]>();
	
	private static final String DefaultAlias = "_E";	//默认实体名
	
	public QueryAnalyzer(){
	}
	
	/**
	 * 是否可用(拥有查询条件项)
	 * @return
	 */
	public boolean enabled(){
		return (!sorters.isEmpty()||!items.isEmpty());
	}
	
	public QueryAnalyzer addItem(String name,String value,String operator,String type){
		items.add(new QueryItem(name,value,operator,type));
		return this;
	}
	
	public QueryAnalyzer addItem(QueryItem item){
		items.add(item);
		return this;
	}
	
	public QueryAnalyzer addSortField(String field){
		sorters.add(new QuerySorter(field));
		return this;
	}
	
	public QueryAnalyzer addSorter(String field, boolean desc){
		sorters.add(new QuerySorter(field, desc));
		return this;
	}
	
	public QueryAnalyzer addSorter(QuerySorter sorter){
		sorters.add(sorter);
		return this;
	}
	
	/**
	 * 构建查询HQL语句
	 * @return
	 */
	public QuerySQL buildQuerySQL(){
		QuerySQL qsql = null;
		String bsql = this.baseSQL;
		StringBuffer mainSql = new StringBuffer(100);		//查询主要语句,不包括条件和排序的
		boolean sqlDesigned = true;			//是否已定义了HQL
		
		if(bsql==null||bsql.length()==-1){
			if(clazz==null){//baseSQL和实体类必须指定一个
				LoggerFactory.getLogger(getClass()).error("QueryAnalyzer.缺少baseSQL或者class属性值!");
				throw new DataAccessException("QueryAnalyzer.缺少baseSQL或者class属性值!");
			}
			sqlDesigned = false;
		}else{
			mainSql.append(bsql);
		}
		
		//解析条件查询语句,并从中判断是否需要自动关联查询
		qsql = buildCriterionSQL(false, sqlDesigned);
		if(!sqlDesigned){
			//如果没指定baseSQL,则根据实体自动生成查询主要语句
			mainSql.append("FROM ").append(clazz.getName()).append(" ").append(DefaultAlias);
			//如果需要关联查询的,则生成关联查询语句
			if(!joinMap.isEmpty()){
				List<String[]> joinList = new ArrayList<String[]>(joinMap.values());
				//按key排序,才能从主实体一层层关联
				Collections.sort(joinList, new Comparator<String[]>() {
					@Override
					public int compare(String[] o1, String[] o2) {
						return o1[1].compareTo(o2[1]);
					}
				});
				for(String[] alias : joinList){
					mainSql.append(" LEFT JOIN FETCH ").append(alias[1]).append(" ").append(alias[0]);	//inner join fetch _E.roles _E1
				}
			}
			mainSql.append(" WHERE 1=1 ");
			//如果该实体是逻辑删除的,则增加逻辑删除的相关查询语句
			if(entity.isVirtualDelete())
				mainSql.append(" AND(").append(DefaultAlias).append(".delflag is null or ").append(DefaultAlias).append(".delflag=0) ");
		}
		//拼接主要查询语句和条件语句
		if(qsql==null)
			qsql = new QuerySQL();
		String csql = qsql.getSql();
		if(csql==null||csql.length()==-1)
			qsql.setSql(mainSql.toString());
		else
			qsql.setSql(mainSql.toString() + " " + csql);
		bsql = null;
		return qsql;
	}
	
	/**
	 * 构建条件SQL语句
	 * @param alias			实体别名
	 * @param withParamName	是否用参数名作为通配符. 
	 * 选择true时,SQL如:and name=:name,此时会给QuerySQL的params赋值;
	 * 选择false时,SQL如:and name=?,此时不会给QuerySQL的params赋值。
	 * @param sqlDesigned	标识是否已指定了baseSQL,如果没指定的才解析关联查询
	 * @return
	 */
	public QuerySQL buildCriterionSQL(boolean withParamName,boolean sqlDesigned){
		if(!enabled())		//没有条件查询及排序,说明不需要解析了
			return null;
		QuerySQL querysql = new QuerySQL();
		
		String alias = entityAlias;
		if(alias==null||alias.length()<1){
			alias = DefaultAlias;
		}
		
		List<Object> valist = new ArrayList<Object>();
		StringBuilder sql = new StringBuilder(100);
		
		//参数名通配符处理
		if(withParamName){
			List<String> palist = new ArrayList<String>();
			for(QueryItem item:items){
				sql.append(" AND ");
				//需关联查询
				if(!sqlDesigned && item.isJoin()){
					sql.append(getJoinAlias(item, alias));
				}else{
					sql.append(alias).append(".").append(item.getName());
				}
				sql.append(item.getCriterionSQLWithName());
				palist.add(item.getName());
				valist.add(item.getCriterionValue());
			}
			String[] params = new String[palist.size()];
			for(int i=0;i<palist.size();i++){
				params[i] = palist.get(i);
			}
			querysql.setParams(params);
			palist = null;
		}else{
			for(QueryItem item:items){
				sql.append(" AND ");
				//需关联查询
				if(!sqlDesigned && item.isJoin()){
					sql.append(getJoinAlias(item, alias));
				}else{
					sql.append(alias).append(".").append(item.getName());
				}
				sql.append(item.getCriterionSQL());
				valist.add(item.getCriterionValue());
			}
		}
		//处理排序语句
		if(!sorters.isEmpty()){
			sql.append(" ORDER BY ");
			for(int i=0,len=sorters.size(),point=len-1;i<len;i++){
				QuerySorter s = sorters.get(i);
				//需关联查询
				if(!sqlDesigned && s.isJoin()){
					sql.append(getJoinAlias(s, alias));
				}else{
					sql.append(alias).append(".").append(s.getName());
				}
				if(s.isDesc())
					sql.append(" DESC");
				if(i<point)
					sql.append(",");
			}
		}
		
		querysql.setSql(sql.toString());
		querysql.setValues(valist.toArray());
		
		valist = null;
		
		return querysql;
	}
	
	/**
	 * 获取关联查询别名,同时将关联查询信息存入joinMap
	 * @param item		关联查询的单个字段信息
	 * @param alias		实体别名
	 * @return
	 */
	private String getJoinAlias(Joinable item,String alias){
		/**
		 * 以SysUser为例,如果传入的字段为roles.menus.funs.funId,则将解析出以下信息
		 * KEY				values				beforeKey		beforeAlias
		 * roles			-[_E1,alias.roles]	""				alias
		 * roles.menus		-[_E2,_E1.menus]	roles			_E1
		 * roles.menus.funs	-[_E3,_E2.funs]		roles.menus		_E2
		 * 
		 * 最终roles.menus.funs.funId 解析成为： _E3.funId	不存入Map
		 */
		String[] joins = item.getJoins();
		String beforeKey = "";		//前一次循环的KEY	
		String beforeAlias = alias;	//前一次循环的别名
		String joinDst = null;
		
		//通过.分隔多层次字段(如:roles.menus.menuId),再进行一层层解析,将需要关联查询的实体及实体别名存入joinMap,最终得到解析转换后字段的HQL字段
		for(int i=0,len=joins.length,point=len-1;i<len;i++){
			String join = joins[i];		//roles、menus、meuId
			String key = beforeKey + (i==0?join:"."+join);	//roles、roles.menus、roles.menus.menuId
			String[] values = joinMap.get(key);	//[_E1,alias.roles] [_E2,_E1.menus]
			if(values==null){
				values = new String[2]; 
				values[0] = DefaultAlias + (++joinIndex);	//_E1
				values[1] = beforeAlias + "." + join;	//alias.roles _E1.menus
				if(i<point)
					joinMap.put(key, values);
			}
			if(i==point)
				joinDst = values[1];		//_E2.menuId
			beforeAlias = values[0];
			beforeKey = key;
			join = null;
			key = null;
		}
		joins = null;
		beforeKey = null;
		beforeAlias = null;
		return joinDst;
	}
	
	public Pagination getPage() {
		return page;
	}
	public QueryAnalyzer setPage(Pagination page) {
		this.page = page;
		return this;
	}
	public QueryAnalyzer setBaseSQL(String baseSQL,String entityAlias) {
		this.baseSQL = baseSQL;
		this.entityAlias = entityAlias;
		return this;
	}
	public QueryAnalyzer setEntity(BaseEntity entity) {
		this.entity = entity;
		clazz = entity.getClass();
		return this;
	}
}
