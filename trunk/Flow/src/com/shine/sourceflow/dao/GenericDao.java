package com.shine.sourceflow.dao;

import java.util.Map;

import com.shine.DBUtil.model.DBModel;
import com.shine.sourceflow.model.GenericDto;
import com.shine.sourceflow.utils.Pagination;

public abstract class GenericDao {
	/** JNDI */
	public static final String JNDI_DEFAULT = "jdbc/flow";
	public static final String JNDI_MONETDB = "jdbc/MonetDB";
	public static final String JNDI_MYSQL = "jdbc/flow";
	public static final String JNDI_CLUSTER = "jdbc/Cluster";
	
	/** 分页类 */
	protected Pagination pagination;
	
	/**
	 * 根据IP进行查询
	 * 
	 * @param dto
	 * @return
	 */
	public Map<String, DBModel> listById(GenericDto dto) {
		return null;
	}
	
	/**
	 * 查询
	 * 
	 * @param dto
	 * @return
	 */
	public Map<String, DBModel> list(GenericDto dto) {
		return null;
	}
	
	/**
	 * 编辑
	 * 
	 * @param dto
	 */
	public void edit(GenericDto dto) {
		
	}
	
	/**
	 * 删除
	 * 
	 * @param dto
	 */
	public void delete(GenericDto dto) {
		
	}
	
	/**
	 * 添加
	 * 
	 * @param dto
	 */
	public void add(GenericDto dto) {
		
	}
	
	/**
	 * 获取当前查询总记录数
	 * 
	 * @param dto
	 * @return
	 */
	public int count(GenericDto dto) {
		return 0;
	}
	
	public Pagination getPagination() {
		return this.pagination;
	}
}
