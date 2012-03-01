package com.shine.framework.dao.callBack;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.hibernate.Query;
import org.hibernate.SQLQuery;
import org.hibernate.type.Type;

/**
 * 自定义 Hibernate SQL操作回调基类 (包含SQL操作的基本属性和方法)
 * addEntity、addJoin和addScalar传入的值在查询时将会传入SQLQuery
 * @author JiangKunpeng 2010-11-18
 * @version 2010-11-18
 *
 */
public abstract class SQLCallBack extends BaseCallBack{
	
	protected List<Class> entityCs = new ArrayList<Class>();
	protected List<String> entityStrs = new ArrayList<String>();
	protected Map<String, Class> cmap = new HashMap<String, Class>();
	protected Map<String, String> strmap = new HashMap<String, String>();
	protected Map<String, String> joinmap = new HashMap<String, String>();
	protected Map<String, Type> scalarmap = new HashMap<String, Type>();
	
	public SQLCallBack(String sql,Object[] values,boolean haveParamNames){
		super(sql, values, haveParamNames);
	}

	@Override
	protected void setParameters(Query query) {
		super.setParameters(query);
		SQLQuery sqlQuery = (SQLQuery)query;
		registerEntity(sqlQuery);
		registerJoin(sqlQuery);
		registerScalar(sqlQuery);
	}
	
	/**
	 * 将所有Entity加入SQLQuery
	 * @param query
	 */
	protected void registerEntity(SQLQuery query){
		for(Class clazz:entityCs){
			query.addEntity(clazz);
		}
		for(String clazz:entityStrs){
			query.addEntity(clazz);
		}
		Iterator<String> it = cmap.keySet().iterator();
		String key = null;
		while(it.hasNext()){
			key = it.next();
			query.addEntity(cmap.get(key));
		}
		it = strmap.keySet().iterator();
		while(it.hasNext()){
			key = it.next();
			query.addEntity(strmap.get(key));
		}
		it = null;
		key = null;
	}
	
	/**
	 * 将所有Join加入SQLQuery
	 * @param query
	 */
	protected void registerJoin(SQLQuery query){
		Iterator<String> it = joinmap.keySet().iterator();
		String key = null;
		while(it.hasNext()){
			key = it.next();
			query.addJoin(key, joinmap.get(key));
		}
		it = null;
		key = null;
	}
	
	/**
	 * 将所有Scalar加入SQLQuery
	 * @param query
	 */
	protected void registerScalar(SQLQuery query){
		Iterator<String> it = scalarmap.keySet().iterator();
		String key = null;
		while(it.hasNext()){
			key = it.next();
			query.addScalar(key, scalarmap.get(key));
		}
		it = null;
		key = null;
	}
	
	/**
	 * 设置SQL表的关联类，并确定查询结果集中的实体类型
	 * @param clazz
	 * @return
	 */
	public SQLCallBack addEntity(Class clazz){
		if(clazz!=null)
			entityCs.add(clazz);
		return this;
	}
	
	/**
	 * 设置表别名关联的类，并确定查询结果集中的实体类型
	 * @param clazz
	 * @return
	 */
	public SQLCallBack addEntity(String clazz){
		if(clazz!=null)
			entityStrs.add(clazz);
		return this;
	}
	
	/**
	 * 设置表别名关联的类
	 * @param alias		SQL中的别名
	 * @param clazz		关联类
	 * @return
	 */
	public SQLCallBack addEntity(String alias,Class clazz){
		cmap.put(alias, clazz);
		return this;
	}
	
	/**
	 * 设置表别名关联的类
	 * @param alias		SQL中的别名
	 * @param clazz		关联类
	 * @return
	 */
	public SQLCallBack addEntity(String alias,String clazz){
		strmap.put(alias, clazz);
		return this;
	}
	
	/**
	 * 载入其他别名的关联
	 * @param alias
	 * @param field
	 * @return
	 */
	public SQLCallBack addJoin(String alias,String field){
		joinmap.put(alias, field);
		return this;
	}
	
	/**
	 * 设置返回结果的标量值
	 * @param field
	 * @param type
	 * @return
	 */
	public SQLCallBack addScalar(String field,Type type){
		scalarmap.put(field, type);
		return this;
	}
	
}
