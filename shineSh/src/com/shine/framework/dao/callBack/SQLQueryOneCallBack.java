package com.shine.framework.dao.callBack;

import java.sql.SQLException;

import org.hibernate.HibernateException;
import org.hibernate.SQLQuery;
import org.hibernate.Session;

/**
 * SQL唯一结果查询回调类
 * @author JiangKunpeng 2010-11-17
 * @version 2010-11-18
 *
 */
public class SQLQueryOneCallBack extends SQLCallBack{
	
	/**
	 * 构建SQL唯一结果查询回调对象
	 * @param sql		SQL语句
	 * @param values	参数值集合
	 */
	public SQLQueryOneCallBack(String sql,Object... values){
		super(sql, values, false);
	}
	
	/**
	 * 构建SQL唯一结果查询回调对象
	 * @param sql			SQL语句
	 * @param paramNames	参数名集合
	 * @param values		参数值集合
	 */
	public SQLQueryOneCallBack(String sql,String[] paramNames,Object[] values){
		super(sql, values, paramNames!=null);
		this.paramNames = paramNames;
	}
	
	public Object doInHibernate(Session session) throws HibernateException,
		SQLException {
		Object o = null;
		SQLQuery query = null;
		if(sql!=null&&!"".equals(sql)){
			query = session.createSQLQuery(sql);
			
			//设置参数
			setParameters(query);
			
			o = query.uniqueResult();
			query = null;
		}
		return o;
	}
	
}
