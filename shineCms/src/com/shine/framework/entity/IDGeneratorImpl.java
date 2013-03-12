package com.shine.framework.entity;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

import org.hibernate.Session;
import org.hibernate.SessionFactory;

import com.shine.framework.exception.DataAccessException;

public class IDGeneratorImpl implements IDGenerator{
	private Map<String, AtomicInteger> map = new ConcurrentHashMap<String, AtomicInteger>();
	
	private SessionFactory sessionFactory;
	
	private AtomicInteger initAtomicInt(String className,String field){
		Session session = null;
		AtomicInteger atoint = null;
		try{
			session = sessionFactory.openSession();
			String sql = "select max(" + field + ") from " + className;
			Object obj = session.createQuery(sql).uniqueResult();
			if(obj!=null)
				atoint = new AtomicInteger(Integer.parseInt(obj.toString()) + 1);
			else
				atoint = new AtomicInteger(1);
			map.put(className, atoint);
		}catch(Exception e){
			throw new DataAccessException("初始化自增长ID异常!ClassName:"+className+"Field:"+field,e);
		}finally{
			if(session!=null&&session.isOpen())
				session.close();
		}
		return atoint;
	}
	
	public int getIntID(String className,String field){
		AtomicInteger atoint = map.get(className);
		if(atoint==null)
			atoint = initAtomicInt(className, field);
		return atoint.getAndIncrement();
	}

	public void setSessionFactory(SessionFactory sessionFactory) {
		this.sessionFactory = sessionFactory;
	}
}
