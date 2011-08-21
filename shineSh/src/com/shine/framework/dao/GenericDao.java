package com.shine.framework.dao;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

import org.hibernate.criterion.DetachedCriteria;
import org.springframework.orm.hibernate3.HibernateCallback;
import org.springframework.orm.hibernate3.HibernateTemplate;

import com.shine.framework.dao.util.Pagination;

/**
 * 数据库基本操作接口
 * @author JiangKunpeng 2010.11.18
 * @version 2011.06.27
 *
 */
public interface GenericDao {
	/**
	 * 获取HibernateTemplate
	 * @return
	 */
	public HibernateTemplate getHibernateTemp();
	
	/**
	 * 保存
	 * @param entity
	 * @return
	 */
	public Serializable save(Object entity);
	
	/**
	 * 更新
	 * @param entity
	 */
	public void update(Object entity);
	
	/**
	 * 保存或者更新
	 * @param entity
	 */
	public void saveOrUpdate(Object entity);
	
	public Object merge(Object entity);
	
	/**
	 * 更新并同步实体
	 * @param entity
	 */
	public void refresh(Object entity);
	
	/**
	 * 删除
	 * @param entity
	 */
	public void delete(Object entity);
	
	/**
	 * 通过ID删除
	 * @param clazz
	 * @param id
	 */
	public void deleteById(Class clazz,Serializable[] id);
	
	/**
	 * 通过ID删除
	 * @param clazz
	 * @param id
	 */
	public void deleteById(Class clazz,Serializable id);
	
	/**
	 * 通过主键加载单个实体
	 * @param clazz
	 * @param id
	 * @param lock	是否锁定
	 * @return
	 */
	public Object load(Class clazz, Serializable id, boolean lock);
	
	/**
	 * 通过主键加载单个实体
	 * @param clazz
	 * @param id
	 * @return
	 */
	public Object load(Class clazz, Serializable id);
	
	/**
	 * 通过主键查询单个实体
	 * @param clazz
	 * @param id
	 * @return
	 */
	public Object get(Class clazz, Serializable id);
	
	/**
	 * 加载所有实体
	 * @param clazz
	 * @return
	 */
	public List loadAll(Class clazz);
	
	/**
	 * 通过HQL语句查询
	 * @param hql
	 * @return
	 */
	public List find(String hql);
	
	/**
	 * 通过HQL语句查询
	 * @param hql
	 * @param values	预处理参数值
	 * @return
	 */
	public List find(String hql,Object[] values);
	
	/**
	 * 通过HQL语句查询
	 * @param hql
	 * @param paramNames	预处理参数名
	 * @param values		预处理参数值
	 * @return
	 */
	public List find(String hql,String[] paramNames,Object[] values);

	/**
	 * 查询单个实体
	 * @param hql
	 * @return
	 */
	public Object findOne(String hql);
	
	/**
	 * 查询单个实体
	 * @param hql
	 * @param values		预处理参数值
	 * @return
	 */
	public Object findOne(String hql,Object[] values);
	
	/**
	 * 查询单个实体
	 * @param hql
	 * @param paramNames	预处理参数名
	 * @param values		预处理参数值
	 * @return
	 */
	public Object findOne(String hql,String[] paramNames,Object[] values);
	
	/**
	 * 条件查询
	 * @param criteria
	 * @return
	 */
	public List findByCriteria(DetachedCriteria criteria);
	
	/**
	 * 条件查询并分页
	 * @param criteria
	 * @param firstResult
	 * @param maxResults
	 * @return
	 */
	public List findByCriteria(DetachedCriteria criteria,int firstResult,int maxResults);
	
	/**
	 * 执行HQL更新语句
	 * @param hql
	 * @return
	 */
	public int executeUpdate(String hql);

	/**
	 * 执行HQL更新语句 
	 * @param hql
	 * @param values	预处理参数值
	 * @return
	 */
	public int executeUpdate(String hql,Object[] values);
	
	/**
	 * 通过实体查询
	 * @param entity
	 * @return
	 */
	public List findByExample(Object entity);
	
	/**
	 * 通过实体查询并分页
	 * @param entity
	 * @param firstResult
	 * @param maxResults
	 * @return
	 */
	public List findByExample(Object entity,int firstResult,int maxResults);
	
	/**
	 * 通过HQL查询
	 * @param hql
	 * @param paramNames	HQL命名参数名集合
	 * @param values		参数值集合
	 * @return
	 */
	public List findByNamedParam(String hql,String[] paramNames,Object[] values);
	
	/**
	 * 执行回调类
	 * @param callback	Hibernate 回调类
	 * @return
	 */
	public Object execute(HibernateCallback callback);
	
	/**
	 * HQL分页查询
	 * @param page		分页实体
	 * @param hql		HQL语句
	 * @param values	参数值集合
	 * @return
	 */
	public List list(String hql,Pagination page,Object[] values);
	
	/**
	 * HQL分页查询
	 * @param hql			HQL语句
	 * @param paramNames	参数名集合
	 * @param values		参数值集合
	 * @param page			分页实体
	 * @return
	 */
	public List list(String hql,String[] paramNames,Object[] values,Pagination page);
	
	/**
	 * 通过SQL查询单条记录
	 * @param clazz		返回实体类型,如果为null则返回Object
	 * @param sql
	 * @param values	参数值集合
	 * @return
	 */
	public Object findOneBySQL(Class clazz,String sql,Object[] values);
	
	/**
	 * 通过SQL查询单条记录
	 * @param clazz			返回实体类型,如果为null则返回Object
	 * @param sql
	 * @param paramNames	参数名集合
	 * @param values		参数值集合
	 * @return
	 */
	public Object findOneBySQL(Class clazz,String sql,String[] paramNames,Object[] values);
	
	/**
	 * 通过SQL查询
	 * @param clazz		返回List中的实体类型,如果为null则为Object数组
	 * @param sql
	 * @param values	参数值集合
	 * @return
	 */
	public List listBySQL(Class clazz,String sql,Object[] values);
	
	/**
	 * 通过SQL查询
	 * @param clazz			返回List中的实体类型,如果为null则为Object数组
	 * @param sql
	 * @param paramNames	参数名集合
	 * @param values		参数值集合
	 * @return
	 */
	public List listBySQL(Class clazz,String sql,String[] paramNames,Object[] values);
	
	/**
	 * 通过SQL查询并分页
	 * @param clazz			返回List中的实体类型,如果为null则为Object数组
	 * @param sql
	 * @param page			分页实体
	 * @param values		参数值集合
	 * @return
	 */
	public List listBySQL(Class clazz,String sql,Pagination page,Object[] values);
	
	/**
	 * 通过SQL查询并分页
	 * @param clazz			返回List中的实体类型,如果为null则为Object数组
	 * @param sql
	 * @param page			分页实体
	 * @param paramNames	参数名集合
	 * @param values		参数值集合
	 * @return
	 */
	public List listBySQL(Class clazz,String sql,String[] paramNames,Object[] values,Pagination page);
	
	/**
	 * 执行SQL
	 * @param sql
	 * @param values	参数值集合
	 * @return
	 */
	public Object executeSQL(String sql,Object[] values);
	
	/**
	 * 执行SQL
	 * @param sql
	 * @param paramNames	参数名集合
	 * @param values		参数值集合
	 * @return
	 */
	public Object executeSQL(String sql,String[] paramNames,Object[] values);
	
	/**
	 * 通过SQL查询,返回原始结果
	 * @param sql
	 * @return
	 */
	public List<Map<String, Object>> findNativeSQL(final String sql);
	
	/**
	 * 通过SQL查询,返回原始结果
	 * @param sql
	 * @param values	参数值集合
	 * @return
	 */
	public List<Map<String, Object>> findNativeSQL(final String sql,final Object[] values);
}
