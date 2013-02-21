package com.shine.framework.dao.impl;

import java.io.Serializable;
import java.lang.reflect.Method;
import java.sql.SQLException;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.hibernate.HibernateException;
import org.hibernate.LockMode;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.engine.SessionFactoryImplementor;
import org.hibernate.hql.QueryTranslator;
import org.hibernate.metadata.ClassMetadata;
import org.hibernate.transform.Transformers;
import org.springframework.orm.hibernate3.HibernateCallback;
import org.springframework.orm.hibernate3.HibernateTemplate;
import org.springframework.orm.hibernate3.support.HibernateDaoSupport;

import com.shine.framework.dao.GenericDao;
import com.shine.framework.dao.callBack.HQLListCallBack;
import com.shine.framework.dao.callBack.SQLExecuteCallBack;
import com.shine.framework.dao.callBack.SQLListCallBack;
import com.shine.framework.dao.callBack.SQLQueryOneCallBack;
import com.shine.framework.dao.util.Pagination;
import com.shine.framework.entity.BaseEntity;
import com.shine.framework.exception.DataAccessException;
import com.shine.platform.logger.LoggerFactory;

/**
 * 数据库基本操作实现类
 * @author JiangKunpeng 2010.11.18
 * @version 2011.06.27
 *
 */
public class GenericDaoImpl extends HibernateDaoSupport implements GenericDao{
	
	@Override
	public HibernateTemplate getHibernateTemp() {
		return getHibernateTemplate();
	}
	
	/**
	 * 获取实体类信息
	 * @param clazz
	 * @return
	 */
	protected ClassMetadata getClassMetadata(Class clazz){
		return this.getSessionFactory().getClassMetadata(clazz);
	}
	
	/**
	 * 获取实体属性值
	 * @param entity
	 * @param propertityName
	 * @return
	 */
	protected Object getEntityPropertityValue(final BaseEntity entity,final String propertityName){
		String f = null;
		String mname = null;
		Method m = null;
		try {
			f = propertityName.substring(0, 1);
			mname = "get" + f.toUpperCase();
			if(mname.length()>1)
				mname = mname + propertityName.substring(1); 
			m = entity.getClass().getMethod(mname, null);
			return m.invoke(entity, null);
		} catch (Exception e) {
			LoggerFactory.getLogger(getClass()).error("获取实体属性值异常", e);
			throw new DataAccessException("获取实体属性值异常", e);
		} finally{
			f = null;
			mname = null;
			m = null;
		}
	}
	
	/**
	 * 获取实体的主键值
	 * @param entity
	 * @return
	 */
	protected Serializable getPkValue(final BaseEntity entity){
		ClassMetadata cm = getClassMetadata(entity.getClass());
		String pkName = cm.getIdentifierPropertyName();
		Object v = getEntityPropertityValue(entity, pkName);
		if(v==null)
			return null;
		String t = cm.getIdentifierType().getName();
		Serializable s = null;
		if("string".equals(t))
			s = v.toString();
		else if(t.startsWith("int"))
			s = Integer.parseInt(v.toString());
		else if("long".equals(t))
			s = Long.parseLong(v.toString());
		else 
			s = v.toString();
		return s;
	}
	
	/**
	 * 将主键值转换成正确的类型
	 * @param identifierType	主键类型
	 * @param pkValue			主键值
	 * @return
	 */
	protected Serializable pkTransform(final String identifierType,final Serializable pkValue){
		Serializable s = null;
		if("string".equals(identifierType))
			s = pkValue.toString();
		else if(identifierType.startsWith("int"))
			s = Integer.parseInt(pkValue.toString());
		else if("long".equals(identifierType))
			s = Long.parseLong(pkValue.toString());
		else 
			s = pkValue.toString();
		return s;
	}
	
	/**
	 * 将主键值转换成正确的类型
	 * @param identifierType	主键类型
	 * @param pkValue			主键值
	 * @return
	 */
	protected Serializable[] pkTransform(final String identifierType,final Serializable[] pkValue){
		int len = pkValue.length;
		if("string".equals(identifierType)){
			String[] ids = new String[len];
			for(int i=0;i<len;i++)
				ids[i] = pkValue[i].toString();
			return ids;
		}else if(identifierType.startsWith("int")){
			Integer[] ids = new Integer[len];
			for(int i=0;i<len;i++)
				ids[i] = Integer.parseInt(pkValue[i].toString());
			return ids;
		}else if("long".equals(identifierType)){
			Long[] ids = new Long[len];
			for(int i=0;i<len;i++)
				ids[i] = Long.parseLong(pkValue[i].toString());
			return ids;
		}
		return pkValue;
	}
	
	/**
	 * 将主键值转换成实体主键对应的类型
	 * @param entity
	 * @param pkValue
	 * @return
	 */
	protected Serializable pkTransform(final Class clazz,final Serializable pkValue){
		if(pkValue==null)
			return pkValue;
		ClassMetadata cm = getClassMetadata(clazz);
		String t = cm.getIdentifierType().getName();
		return pkTransform(t, pkValue);
	}
	
	/**
	 * 将主键值转换成实体主键对应的类型
	 * @param entity
	 * @param pkValue
	 * @return
	 */
	protected Serializable[] pkTransform(final Class clazz,final Serializable[] pkValue){
		if(pkValue==null)
			return pkValue;
		ClassMetadata cm = getClassMetadata(clazz);
		String t = cm.getIdentifierType().getName();
		return pkTransform(t, pkValue);
	}
	
	/**
	 * HQL转成SQL
	 * @param hql
	 * @return
	 */
	protected String hql2sql(String hql){
//		QueryTranslator qt = new org.hibernate.hql.classic.QueryTranslatorImpl(hql, Collections.EMPTY_MAP, (SessionFactoryImplementor)this.getSessionFactory());
		QueryTranslator qt = new org.hibernate.hql.ast.QueryTranslatorImpl(hql, hql, Collections.EMPTY_MAP, (SessionFactoryImplementor)this.getSessionFactory());
		qt.compile(Collections.EMPTY_MAP, false);
		return qt.getSQLString();
	}
	
	/**
	 * 组装求总数SQL语句
	 * @param sql
	 * @return
	 */
	protected String buildCountSQL(String sql){
		return "SELECT COUNT(*) FROM (" + sql + ") tmp_ct";
	}
	
	public void deleteById(Class clazz,Serializable[] id){
		if(id!=null){
			Object o = null;
			for (Serializable s : id) {
				o = get(clazz, s);
				if(o!=null)
					delete(o);
			}
			o = null;
		}
	}
	
	public void deleteById(Class clazz,Serializable id){
		if(id!=null){
			Object o  = get(clazz, id);
			if(o!=null)
				delete(o);
			o = null;
		}
	}
	
	public void delete(Object entity) {
		getHibernateTemplate().delete(entity);
	}

	public Serializable save(Object entity) {
		return getHibernateTemplate().save(entity);
	}

	public void saveOrUpdate(Object entity) {
		getHibernateTemplate().saveOrUpdate(entity);
	}

	public void update(Object entity) {
		getHibernateTemplate().update(entity);
	}
	
	public Object merge(Object entity){
		return getHibernateTemplate().merge(entity);
	}
	
	public void refresh(Object entity){
		getHibernateTemplate().refresh(entity);
	}

	public Object get(Class clazz, Serializable id) {
		return getHibernateTemplate().get(clazz, id);
	}

	public Object load(Class clazz, Serializable id, boolean lock) {
		if(lock)
			return getHibernateTemplate().load(clazz, id,  LockMode.UPGRADE);
		else
			return getHibernateTemplate().load(clazz, id);
	}

	public Object load(Class clazz, Serializable id) {
		return getHibernateTemplate().load(clazz, id);
	}
	
	public List loadAll(Class clazz){
		return getHibernateTemplate().loadAll(clazz);
	}
	
	public List find(String hql){
		return getHibernateTemplate().find(hql);
	}
	
	public List find(String hql,Object[] values){
		return getHibernateTemplate().find(hql, values);
	}
	
	public List find(String hql,String[] paramNames,Object[] values){
		return getHibernateTemplate().findByNamedParam(hql, paramNames, values);
	}
	
	public List findByCriteria(DetachedCriteria criteria){
		return getHibernateTemplate().findByCriteria(criteria);
	};
	
	public List findByCriteria(DetachedCriteria criteria,int firstResult,int maxResults){
		return getHibernateTemplate().findByCriteria(criteria, firstResult, maxResults);
	};
	
	public int executeUpdate(String hql){
		return getHibernateTemplate().bulkUpdate(hql);
	}
	
	public int executeUpdate(String hql,Object[] values){
		return getHibernateTemplate().bulkUpdate(hql,values);
	}
	
	public List findByExample(Object entity){
		return getHibernateTemplate().findByExample(entity);
	}
	
	public List findByExample(Object entity,int firstResult,int maxResults){
		return getHibernateTemplate().findByExample(entity);
	}
	
	public List findByNamedParam(String hql,String[] paramNames,Object[] values){
		return getHibernateTemplate().findByNamedParam(hql, paramNames, values);
	}
	
	public List findByValueBean(String hql,Object bean){
		return getHibernateTemplate().findByValueBean(hql, bean);
	}
	
	public Object execute(HibernateCallback callback){
		return getHibernateTemplate().execute(callback);
	}
	
	public List list(String hql,Pagination page,Object[] values){		
		return list(hql, null, values, page);
	}
	
	public List list(String hql,String[] paramNames,Object[] values,Pagination page){
		int totalRecord = 0;
		Object o = null;
		try{
			//得到查询结果总数
//			o = getHibernateTemplate().execute(new HQLQueryOneCallBack(SQLExtractor.create(hql).getRowCountSql(), paramNames, values));
			
			/**将上面注释掉的求总数改成：
			 * 将HQL转成SQL，再拼接select count(*) 语句求总数
			 * 以避免复杂的HQL语句
			 */
			String csql = buildCountSQL(hql2sql(hql));
			o = getHibernateTemplate().execute(new SQLQueryOneCallBack(csql, paramNames, values));
			if(o!=null)
				totalRecord = Integer.parseInt(o.toString());
			page.setTotalRecord(totalRecord);
			
			//查询分页后结果
			if(totalRecord>0)
				return getHibernateTemplate().executeFind(new HQLListCallBack(hql, paramNames, values, page.getStart(), page.getPageSize()));
		}catch(Exception e){
			e.printStackTrace();
		}
		return null;
	}
	
	public Object findOneBySQL(Class clazz,String sql,Object[] values){
		return getHibernateTemplate().execute(new SQLQueryOneCallBack(sql,values).addEntity(clazz));
	}
	
	public Object findOneBySQL(Class clazz,String sql,String[] paramNames,Object[] values){
		return getHibernateTemplate().execute(new SQLQueryOneCallBack(sql,paramNames,values).addEntity(clazz));
	}
	
	public List listBySQL(Class clazz,String sql,Object[] values){
		return getHibernateTemplate().executeFind(new SQLListCallBack(sql, values).addEntity(clazz));
	}
	
	public List listBySQL(Class clazz,String sql,String[] paramNames,Object[] values){
		return getHibernateTemplate().executeFind(new SQLListCallBack(sql, paramNames, values).addEntity(clazz));
	}
	
	public List listBySQL(Class clazz,String sql,Pagination page,Object[] values){
		return listBySQL(clazz, sql, null, values, page);
	}
	
	public List listBySQL(Class clazz,String sql,String[] paramNames,Object[] values,Pagination page){
		int totalRecord = 0;
		Object o = null;
		try{
			//得到查询结果总数
//			o = getHibernateTemplate().execute(new SQLQueryOneCallBack(SQLExtractor.create(sql).getRowCountSql(), paramNames, values));
			
			//将上面改成 直接拼接select count(*) 来查询总数
			String csql = buildCountSQL(sql);
			o = getHibernateTemplate().execute(new SQLQueryOneCallBack(csql, paramNames, values));
			if(o!=null)
				totalRecord = Integer.parseInt(o.toString());
			page.setTotalRecord(totalRecord);
			
			//查询分页后结果
			if(totalRecord>0)
				return getHibernateTemplate().executeFind(new SQLListCallBack(sql, paramNames, values, page.getStart(), page.getPageSize()).addEntity(clazz));
		}catch(Exception e){
			e.printStackTrace();
		}
		return null;
	}
	
	public Object executeSQL(String sql,Object[] values){
		return getHibernateTemplate().execute(new SQLExecuteCallBack(sql, values));
	}
	
	public Object executeSQL(String sql,String[] paramNames,Object[] values){
		return getHibernateTemplate().execute(new SQLExecuteCallBack(sql, paramNames, values));
	}
	
	public List<Map<String, Object>> findNativeSQL(final String sql){
		return findNativeSQL(sql, null);
	}
	
	public List<Map<String, Object>> findNativeSQL(final String sql,final Object[] values){
		return (List<Map<String, Object>>)getHibernateTemplate().execute(new HibernateCallback() {
			public Object doInHibernate(Session session) throws HibernateException, SQLException {
				SQLQuery query = session.createSQLQuery(sql);
				if(values!=null){
					for(int i=0;i<values.length;i++){
						query.setParameter(i, values[i]);
					}
				}
				return query.setResultTransformer(Transformers.ALIAS_TO_ENTITY_MAP).list();
			}
		});
	}

	public Object findOne(String hql) {
		List list = find(hql);
		return list==null||list.isEmpty()?null:list.get(0);
	}

	public Object findOne(String hql, Object[] values) {
		List list = find(hql, values);
		return list==null||list.isEmpty()?null:list.get(0);
	}

	public Object findOne(String hql, String[] paramNames, Object[] values) {
		List list = find(hql, paramNames, values);
		return list==null||list.isEmpty()?null:list.get(0);
	}
}
