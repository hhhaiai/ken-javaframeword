package com.shine.sourceflow.service.allocation;

import com.shine.sourceflow.dao.allocation.IPGroupConfigDao;
import com.shine.sourceflow.service.GenericService;

public class IPGroupConfigService extends GenericService {
	public IPGroupConfigService() {
		this.dao = new IPGroupConfigDao();
	}
}
