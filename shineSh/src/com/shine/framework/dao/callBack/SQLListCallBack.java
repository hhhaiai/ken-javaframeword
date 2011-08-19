package com.shine.framework.dao.callBack;

import java.sql.SQLException;
import java.util.List;

import org.hibernate.HibernateException;
import org.hibernate.SQLQuery;
import org.hibernate.Session;

/**
 * SQL多结果查询回调类(可分页)
 * @author JiangKunpeng 2010-11-17
 * @version 2010-11-18
 *
 */
public class SQLListCallBack extends SQLCallBack{
	private int firstResult;	//分页开始索引
	private int maxResults;		//分页结束索引
	
	/**
	 * 构建SQL多结果查询对象
	 * @param sql		SQL语句
	 * @param values	参数值集合
	 */
	public SQLListCallBack(String sql,Object... values){
		super(sql, values, false);
		this.firstResult = -1;
		this.maxResults = -1;
	}
	
	/**
	 * 构建SQL多结果查询对象
	 * @param sql			SQL语句
	 * @param paramNames	参数名集合
	 * @param values		参数值集合
	 */
	public SQLListCallBack(String sql,String[] paramNames,Object[] values){
		super(sql,values,paramNames!=null);
		this.paramNames = paramNames;
		this.firstResult = -1;
		this.maxResults = -1;
	}
	
	/**
	 * 构建SQL多结果查询对象(分页)
	 * @param sql			SQL语句
	 * @param values		参数值集合
	 * @param firstResult	分页开始索引
	 * @param maxResults	分页结束索引
	 */
	public SQLListCallBack(String sql,Object[] values,int firstResult,int maxResults){
		this(sql,values);
		this.firstResult = firstResult;
		this.maxResults = maxResults;
	}
	
	/**
	 * 构建SQL多结果查询对象(分页)
	 * @param sql			SQL语句
	 * @param paramNames	参数名集合
	 * @param values		参数值集合
	 * @param firstResult	分页开始索引
	 * @param maxResults	分页结束索引
	 */
	public SQLListCallBack(String sql,String[] paramNames,Object[] values,int firstResult,int maxResults){
		this(sql, paramNames, values);
		this.paramNames = paramNames;
		this.firstResult = firstResult;
		this.maxResults = maxResults;
	}
	
	public List doInHibernate(Session session) throws HibernateException,
		SQLException {
		List list = null;
		SQLQuery query = null;
		if(sql!=null&&!"".equals(sql)){
			query = session.createSQLQuery(sql);
			
			//设置参数
			setParameters(query);
			
			//设置分页起始索引
			if(firstResult>-1&&maxResults>-1)
				query.setFirstResult(firstResult).setMaxResults(maxResults);
			
			list = query.list();
			query = null;
		}
		return list;
	}
	
}
