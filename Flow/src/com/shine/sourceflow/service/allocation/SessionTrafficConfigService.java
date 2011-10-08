package com.shine.sourceflow.service.allocation;

import com.shine.sourceflow.dao.allocation.SessionTrafficConfigDao;
import com.shine.sourceflow.service.GenericService;

public class SessionTrafficConfigService extends GenericService {
	public SessionTrafficConfigService() {
		this.dao = new SessionTrafficConfigDao();
	}
}
