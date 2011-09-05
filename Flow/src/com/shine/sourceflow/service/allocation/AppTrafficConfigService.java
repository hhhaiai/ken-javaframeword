package com.shine.sourceflow.service.allocation;

import com.shine.sourceflow.dao.allocation.AppTrafficConfigDao;
import com.shine.sourceflow.service.GenericService;

public class AppTrafficConfigService extends GenericService {
	public AppTrafficConfigService() {
		this.dao = new AppTrafficConfigDao();
	}
}
