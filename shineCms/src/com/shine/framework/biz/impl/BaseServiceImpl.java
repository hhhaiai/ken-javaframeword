package com.shine.framework.biz.impl;

import java.util.List;

import com.shine.framework.biz.BaseService;
import com.shine.framework.dao.BaseDao;
import com.shine.framework.dao.util.QueryAnalyzer;
import com.shine.framework.dao.util.QuerySQL;
import com.shine.framework.entity.BaseEntity;
import com.shine.framework.entity.PersistResult;

/**
 * 复杂业务类(通用的增删改查方法)
 * @author JiangKunpeng 2011.09.01
 * @version 2012.12.25
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

	public PersistResult save(BaseEntity entity) {
		try{
			if(dao.exist(entity))
				return new PersistResult(PersistResult.FAILURE, PersistResult.MSG_EXIST);
			dao.save(entity);
		}catch(Exception e){
			e.printStackTrace();
			return new PersistResult(PersistResult.ERROR, PersistResult.MSG_ERROR);
		}
		return new PersistResult(PersistResult.SUCCESS, PersistResult.MSG_SUCCESS);
	}

	public PersistResult update(BaseEntity entity) {
		try{
			if(dao.exist(entity))
				return new PersistResult(PersistResult.FAILURE, PersistResult.MSG_EXIST);
			dao.update(entity);
		}catch(Exception e){
			e.printStackTrace();
			return new PersistResult(PersistResult.ERROR, PersistResult.MSG_ERROR);
		}
		return new PersistResult(PersistResult.SUCCESS, PersistResult.MSG_SUCCESS);
	}
	
	public PersistResult delete(BaseEntity entity,String id){
		try{
			dao.delete(entity, id);
		}catch(Exception e){
			e.printStackTrace();
			return new PersistResult(PersistResult.ERROR, PersistResult.MSG_ERROR);
		}
		return new PersistResult(PersistResult.SUCCESS, PersistResult.MSG_SUCCESS);
	}
	
	public PersistResult delete(BaseEntity entity,String[] ids){
		try{
			dao.delete(entity, ids);
		}catch(Exception e){
			e.printStackTrace();
			return new PersistResult(PersistResult.ERROR, PersistResult.MSG_ERROR);
		}
		return new PersistResult(PersistResult.SUCCESS, PersistResult.MSG_SUCCESS);
	}
	
}
