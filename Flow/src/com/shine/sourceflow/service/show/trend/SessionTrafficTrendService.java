package com.shine.sourceflow.service.show.trend;

import com.shine.sourceflow.dao.show.trend.SessionTrafficTrendDao;
import com.shine.sourceflow.service.GenericService;

public class SessionTrafficTrendService extends GenericService {
	public SessionTrafficTrendService() {
		this.dao = new SessionTrafficTrendDao();
	}
}
