package com.shine.sourceflow.service.show.detail;

import com.shine.sourceflow.dao.show.detail.IPTrafficDetailDao;
import com.shine.sourceflow.service.GenericService;

public class IPTrafficDetailService extends GenericService {
	public IPTrafficDetailService() {
		this.dao = new IPTrafficDetailDao();
	}
}
