package com.shine.framework.dao.callBack;

import java.sql.SQLException;

import org.hibernate.HibernateException;
import org.hibernate.Query;
import org.hibernate.Session;

/**
 * HQL唯一结果查询回调类
 * @author JiangKunpeng 2010-11-17
 * @version 2010-11-17
 *
 */
public class HQLQueryOneCallBack extends BaseCallBack{
	
	/**
	 * 构建HQL唯一结果查询回调对象
	 * @param hql		HQL语句
	 * @param values	参数值集合
	 */
	public HQLQueryOneCallBack(String hql,Object... values){
		super(hql, values, false);
	}
	
	/**
	 * 构建HQL唯一结果查询回调对象
	 * @param hql			HQL语句
	 * @param paramNames	参数名集合
	 * @param values		参数值集合
	 */
	public HQLQueryOneCallBack(String hql,String[] paramNames,Object[] values){
		super(hql, values, paramNames!=null);
		this.paramNames = paramNames;
	}
	
	public Object doInHibernate(Session session) throws HibernateException,
		SQLException {
		Object o = null;
		Query query = null;
		if(sql!=null&&!"".equals(sql)){
			query = session.createQuery(sql);
			
			//设置参数
			setParameters(query);
			
			o = query.uniqueResult();
			query = null;
		}
		return o;
	}
	
}
