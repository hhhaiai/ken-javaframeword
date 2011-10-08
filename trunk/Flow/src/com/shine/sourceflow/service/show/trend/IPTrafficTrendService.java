package com.shine.sourceflow.service.show.trend;

import com.shine.sourceflow.dao.show.trend.IPTrafficTrendDao;
import com.shine.sourceflow.service.GenericService;

public class IPTrafficTrendService extends GenericService {
	public IPTrafficTrendService() {
		this.dao = new IPTrafficTrendDao();
	}
}
