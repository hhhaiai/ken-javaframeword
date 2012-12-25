package com.shine.framework.biz;

import java.util.List;

import com.shine.framework.dao.util.QueryAnalyzer;
import com.shine.framework.entity.BaseEntity;
import com.shine.framework.entity.PersistResult;

public interface BaseService{
	
	public boolean exist(BaseEntity entity);
	
	public PersistResult save(BaseEntity entity);
	
	public PersistResult update(BaseEntity entity);
	
	public PersistResult delete(BaseEntity entity,String id);
	
	public PersistResult delete(BaseEntity entity,String[] ids);
	
	public BaseEntity get(BaseEntity entity);
	
	public List list(QueryAnalyzer queryFilter);
}
