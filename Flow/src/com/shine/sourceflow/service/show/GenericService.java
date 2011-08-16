package com.shine.sourceflow.service.show;

import com.shine.sourceflow.dao.show.GenericDao;
import com.shine.sourceflow.model.show.GenericDTO;

public class GenericService {
	protected GenericDao dao;
	
	public void query(GenericDTO dto) {
		this.dao.query(dto);
	}
}
