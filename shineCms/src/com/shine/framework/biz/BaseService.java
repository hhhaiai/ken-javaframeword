package com.shine.framework.biz;

import java.util.List;

import com.shine.framework.dao.util.QueryAnalyzer;
import com.shine.framework.entity.BaseEntity;

public interface BaseService{
	
	public boolean exist(BaseEntity entity);
	
	public void save(BaseEntity entity);
	
	public void update(BaseEntity entity);
	
	public void delete(BaseEntity entity,String[] ids);
	
	public BaseEntity get(BaseEntity entity);
	
	public List list(QueryAnalyzer queryFilter);
}
