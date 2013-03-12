package com.shine.framework.biz.impl;

import java.util.List;

import com.shine.framework.biz.BaseService;
import com.shine.framework.dao.BaseDao;
import com.shine.framework.dao.util.QueryAnalyzer;
import com.shine.framework.entity.AutoIntIdEntity;
import com.shine.framework.entity.BaseEntity;
import com.shine.framework.entity.PersistResult;
import com.shine.framework.entity.TreeEntity;

/**
 * 业务实现类(通用的增删改查方法)
 * @author JiangKunpeng 2011.09.01
 * @version 2013.03.06
 *
 */
public class BaseServiceImpl extends GenericServiceImpl<BaseDao> implements BaseService{
	
	private com.shine.framework.entity.IDGenerator idGenerator;	//ID生成器,由程序生成时使用
	
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
			//程序生成自动增长ID
			if(entity instanceof AutoIntIdEntity){
				int id = idGenerator.getIntID(entity.getClass().getName(), "id");
				((AutoIntIdEntity) entity).setId(id);
			}
			//树形结构实体,生成树编码
			if(entity instanceof TreeEntity){
				String treeCode = null;
				TreeEntity tentity = (TreeEntity) entity;
				//如果上层节点不是顶层，则取到上层节点的树编码进行拼接
				if(tentity.getPid()>0){
					TreeEntity tmpEntity = (TreeEntity)tentity.clone();
					tmpEntity.setId(tentity.getPid());
					tmpEntity = (TreeEntity)dao.get((BaseEntity)tmpEntity);
					treeCode = tmpEntity.getTreeCode() + tentity.getId() + ",";
				}else{
					treeCode = "," + tentity.getId() + ",";
				}
				((TreeEntity) entity).setTreeCode(treeCode);
			}
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
	
	public PersistResult merge(BaseEntity entity) {
		try{
			if(dao.exist(entity))
				return new PersistResult(PersistResult.FAILURE, PersistResult.MSG_EXIST);
			dao.merge(entity);
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

	public void setIdGenerator(com.shine.framework.entity.IDGenerator idGenerator) {
		this.idGenerator = idGenerator;
	}
	
}
