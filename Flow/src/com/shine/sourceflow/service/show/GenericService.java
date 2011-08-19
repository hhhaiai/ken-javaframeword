package com.shine.sourceflow.service.show;

import com.shine.DBUtil.model.DBModel;
import com.shine.sourceflow.dao.show.GenericDao;
import com.shine.sourceflow.model.show.GenericDTO;

public class GenericService {
	protected GenericDao dao;
	
	public DBModel query(GenericDTO dto) {
		return this.dao.query(dto);
	}
}
