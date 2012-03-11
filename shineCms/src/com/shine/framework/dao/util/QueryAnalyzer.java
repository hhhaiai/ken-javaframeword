package com.shine.framework.dao.util;

import java.util.ArrayList;
import java.util.List;

import com.shine.framework.exception.DataAccessException;

/**
 * 查询分析器
 * @author JiangKunpeng	2011.05.06
 * @version 2011.08.21
 */
public class QueryAnalyzer {
	
	private String sortField;			//排序字段
	private String sortType;			//排序类型
	private List<QueryItem> items = new ArrayList<QueryItem>();	//查询条件集合
	private String baseSQL;		//基本查询SQL,如果没设置则通过clazz自动生成;如：from entityName where 1=1
	private Class clazz;		//生成基本SQL的Class
	private Pagination page;	//分页实体
	
	public QueryAnalyzer(){
	}
	
	/**
	 * 是否可用(拥有查询条件项)
	 * @return
	 */
	public boolean enabled(){
		return (sortField!=null&&!"".equals(sortField))||!items.isEmpty();
	}
	
	public void addItem(String name,String value,String operator,String type){
		items.add(new QueryItem(name,value,operator,type));
	}
	
	public void addItem(QueryItem item){
		items.add(item);
	}
	
	/**
	 * 构建查询SQL语句
	 * @return
	 */
	public QuerySQL buildQuerySQL(){
		QuerySQL qsql = null;
		String bsql = this.baseSQL;
		if(bsql==null||bsql.length()==-1){
			if(clazz==null)
				throw new DataAccessException("QueryAnalyzer.缺少baseSQL或者class属性值!");
			bsql = "from " + clazz.getName() + " tmp where 1=1 ";
		}
		qsql = buildCriterionSQL("tmp", false);
		if(qsql==null)
			qsql = new QuerySQL();
		String csql = qsql.getSql();
		if(csql==null||csql.length()==-1)
			qsql.setSql(bsql);
		else
			qsql.setSql(bsql + " " + csql);
		return qsql;
	}
	
	/**
	 * 构建条件SQL语句
	 * @param alias			实体别名
	 * @param withParamName	是否用参数名作为通配符. 
	 * 选择true时,SQL如:and name=:name,此时会给QuerySQL的params赋值;
	 * 选择false时,SQL如:and name=?,此时不会给QuerySQL的params赋值。
	 * @return
	 */
	public QuerySQL buildCriterionSQL(String alias,boolean withParamName){
		if(!enabled())
			return null;
		
		QuerySQL querysql = new QuerySQL();
		
		String ali = alias;
		boolean nullAlias = false;
		if(ali==null||"".equals(ali)){
			ali = "alias";
			nullAlias = true;
		}
		
		List<Object> valist = new ArrayList<Object>();
		
		StringBuilder sql = new StringBuilder(100);
		
		//参数名通配符处理
		if(withParamName){
			List<String> palist = new ArrayList<String>();
			for(QueryItem item:items){
				sql.append(" AND ").append(ali).append(".");
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
				sql.append(" AND ").append(ali).append(".");
				sql.append(item.getCriterionSQL());
				valist.add(item.getCriterionValue());
			}
		}
		if(sortField!=null&&!"".equals(sortField)){
			sql.append(" ORDER BY ").append(ali).append(".").append(sortField);
			if(sortType==null)
				sortType = "";
			if("desc".equals(sortType.toLowerCase()))
				sql.append(" DESC");
		}
		
		if(nullAlias)
			querysql.setSql(sql.toString().replaceAll(ali+".", ""));
		else
			querysql.setSql(sql.toString());
		
		querysql.setValues(valist.toArray());
		
		valist = null;
		
		return querysql;
	}

	public String getSortField() {
		return sortField;
	}
	public void setSortField(String sortField) {
		this.sortField = sortField;
	}
	public String getSortType() {
		return sortType;
	}
	public void setSortType(String sortType) {
		this.sortType = sortType;
	}
	public Pagination getPage() {
		return page;
	}
	public void setPage(Pagination page) {
		this.page = page;
	}
	public void setBaseSQL(String baseSQL) {
		this.baseSQL = baseSQL;
	}
	public void setClazz(Class clazz) {
		this.clazz = clazz;
	}
}
