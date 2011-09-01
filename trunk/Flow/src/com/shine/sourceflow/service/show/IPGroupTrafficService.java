package com.shine.sourceflow.service.show;

import com.shine.sourceflow.dao.show.IPGroupTrafficDao;
import com.shine.sourceflow.service.GenericService;

public class IPGroupTrafficService extends GenericService {
	public IPGroupTrafficService() {
		this.dao = new IPGroupTrafficDao();
	}
}
