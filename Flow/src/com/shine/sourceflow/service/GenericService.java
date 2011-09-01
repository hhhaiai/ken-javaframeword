package com.shine.sourceflow.service;

import java.util.Map;

import com.shine.DBUtil.model.DBModel;
import com.shine.sourceflow.dao.GenericDao;
import com.shine.sourceflow.model.GenericDto;
import com.shine.sourceflow.utils.Pagination;

public abstract class GenericService {
	protected GenericDao dao;
	
	public Map<String, DBModel> listById(GenericDto dto) {
		return this.dao.listById(dto);
	}
	
	public Map<String, DBModel> list(GenericDto dto) {
		return this.dao.list(dto);
	}
	
	public void edit(GenericDto dto) {
		this.dao.edit(dto);
	}
	
	public void delete(GenericDto dto) {
		this.dao.delete(dto);
	}
	
	public void add(GenericDto dto) {
		this.dao.add(dto);
	}
	
	/**
	 * 获取分页类
	 * 
	 * @return
	 */
	public Pagination getPagination() {
		return this.dao.getPagination();
	}
}
