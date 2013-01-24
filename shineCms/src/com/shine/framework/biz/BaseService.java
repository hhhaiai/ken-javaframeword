package com.shine.framework.biz;

import java.util.List;

import com.shine.framework.dao.util.QueryAnalyzer;
import com.shine.framework.entity.BaseEntity;
import com.shine.framework.entity.PersistResult;

/**
 * 通用业务类接口(通用的增删改查方法)
 * @author JiangKunpeng 2011.09.01
 * @version 2013.1.24
 *
 */
public interface BaseService{
	
	public boolean exist(BaseEntity entity);
	
	public PersistResult save(BaseEntity entity);
	
	/**
	 * 执行更新（强制执行update语句,不管是否存在记录或有无属性变化）
	 * @param entity
	 * @return
	 */
	public PersistResult update(BaseEntity entity);
	
	/**
	 * 执行更新,有以下几种情况<br/>
	 * 1、当数据库中存在该数据时:<br/>
	 * 		如果相对数据库中数据有改动则执行更新,否则不执行更新<br/>
	 * 2、当数据库中不存在该数据时:<br/>
	 * 		执行insert操作
	 * @param entity
	 * @return
	 */
	public PersistResult merge(BaseEntity entity);
	
	public PersistResult delete(BaseEntity entity,String id);
	
	public PersistResult delete(BaseEntity entity,String[] ids);
	
	public BaseEntity get(BaseEntity entity);
	
	public List list(QueryAnalyzer queryFilter);
}
