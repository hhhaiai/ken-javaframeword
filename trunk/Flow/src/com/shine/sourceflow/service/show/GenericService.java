package com.shine.sourceflow.service.show;

import java.util.Map;

import com.shine.DBUtil.model.DBModel;
import com.shine.sourceflow.dao.show.GenericDao;
import com.shine.sourceflow.model.show.GenericDTO;

public class GenericService {
	protected GenericDao dao;
	
	public Map<String, DBModel> query(GenericDTO dto) {
		return this.dao.query(dto);
	}
}
