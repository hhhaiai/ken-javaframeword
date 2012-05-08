package com.shine.framework.dao;

import java.io.Serializable;
import java.util.List;

import com.shine.framework.dao.util.QueryAnalyzer;
import com.shine.framework.entity.BaseEntity;

/**
 * 数据库操作扩展功能(复杂查询等)
 * @author JiangKunpeng	2011.05.04
 * @version 2011.09.01
 */
public interface BaseDao extends GenericDao{
	
	/**
	 * 通过实体和主键值查询
	 * @param entity	需设置主键值
	 * @return
	 */
	public BaseEntity get(BaseEntity entity);
	
	/**
	 * 通过实体删除
	 * @param entity		
	 */
	public void delete(BaseEntity entity);
	
	/**
	 * 通过主键删除
	 * @param entity		
	 * @param pkValue	主键值
	 */
	public void delete(BaseEntity entity, Serializable pkValue);
	
	/**
	 * 通过主键删除
	 * @param entity		
	 * @param pkValues	主键值
	 */
	public void delete(BaseEntity entity, Serializable[] pkValues);
	
	/**
	 * 条件查询
	 * @param queryFilter	条件实体
	 * @return
	 */
	public List list(QueryAnalyzer queryFilter);
	
	/**
	 * 判断实体是否存在
	 * @param entity
	 * @return
	 */
	public boolean exist(BaseEntity entity);
	
}
