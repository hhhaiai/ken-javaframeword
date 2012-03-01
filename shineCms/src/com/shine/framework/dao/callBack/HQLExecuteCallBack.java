package com.shine.framework.dao.callBack;

import java.sql.SQLException;

import org.hibernate.HibernateException;
import org.hibernate.Query;
import org.hibernate.Session;

/**
 * HQL执行回调类 (作用：执行HQL更新语句)
 * @author JiangKunpeng 2010-11-17
 * @version 2010-11-17
 *
 */
public class HQLExecuteCallBack extends BaseCallBack{
	
	/**
	 * 构建HQL执行回调对象
	 * @param hql		HQL语句
	 * @param values	参数值集合
	 */
	public HQLExecuteCallBack(String hql,Object... values){
		super(hql, values, false);
	}
	
	/**
	 * 构建HQL执行回调对象
	 * @param hql			HQL语句
	 * @param paramNames	参数名集合
	 * @param values		参数值集合
	 */
	public HQLExecuteCallBack(String hql,String[] paramNames,Object[] values){
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
			
			o = query.executeUpdate();
			query = null;
		}
		return o;
	}
	
}
