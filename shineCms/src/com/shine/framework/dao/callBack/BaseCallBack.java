package com.shine.framework.dao.callBack;

import org.hibernate.Query;
import org.springframework.orm.hibernate3.HibernateCallback;

/**
 * 自定义 Hibernate 回调基类(包含最基本属性和方法)
 * @author JiangKunpeng 2010-11-17
 * @version 2010-11-17
 *
 */
public abstract class BaseCallBack implements HibernateCallback{
	
	protected String sql;				//SQL、HQL语句
	protected String[] paramNames;		//参数名集合
	protected Object[] values;			//参数值集合
	protected boolean haveParamNames;	//有参数名集合
	
	protected BaseCallBack(String sql,Object[] values,boolean haveParamNames){
		this.sql = sql;
		this.values = values;
		this.haveParamNames = haveParamNames;
	}
	
	/**
	 * 给query设置参数
	 * @param query
	 */
	protected void setParameters(Query query){
		if(haveParamNames)
			setParameters(query, paramNames, values);
		else
			setParameters(query, values);
	}
	
	/**
	 * 给query设置参数值(? 类型参数)
	 * @param query
	 * @param values	参数值集合
	 */
	protected void setParameters(Query query,Object[] values){
		if(values!=null){
			for(int i=0;i<values.length;i++){
				query.setParameter(i, values[i]);
			}
		}
	}
	
	/**
	 * 给query设置参数值(:paramName 类型参数)
	 * @param query
	 * @param paramNames	参数名集合
	 * @param values		参数值集合
	 */
	protected void setParameters(Query query,String[] paramNames,Object[] values){
		if(paramNames!=null){
			for(int i=0;i<paramNames.length;i++){
				query.setParameter(paramNames[i], values[i]);
			}
		}
	}
	
}
