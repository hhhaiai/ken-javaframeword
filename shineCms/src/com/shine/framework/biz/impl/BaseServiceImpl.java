package com.shine.framework.biz.impl;

import java.util.List;

import com.shine.framework.biz.BaseService;
import com.shine.framework.dao.BaseDao;
import com.shine.framework.dao.util.QueryAnalyzer;
import com.shine.framework.entity.BaseEntity;

/**
 * 复杂业务类(通用的增删改查方法)
 * @author JiangKunpeng 2011.09.01
 * @version 2011.09.01
 *
 */
public class BaseServiceImpl extends GenericServiceImpl<BaseDao> implements BaseService{
	
	public boolean exist(BaseEntity entity) {
		return dao.exist(entity);
	}

	public BaseEntity get(BaseEntity entity) {
		return dao.get(entity);
	}

	public List list(QueryAnalyzer queryFilter) {
		return dao.list(queryFilter);
	}

	public void save(BaseEntity entity) {
		dao.save(entity);
	}

	public void update(BaseEntity entity) {
		dao.update(entity);
	}
	
	public void delete(BaseEntity entity,String id){
		dao.delete(entity, id);
	}
	
	public void delete(BaseEntity entity,String[] ids){
		dao.delete(entity, ids);
	}
	
}
