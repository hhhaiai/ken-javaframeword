package com.shine.sourceflow.service.show.trend;

import com.shine.sourceflow.dao.show.trend.IPGroupTrafficTrendDao;
import com.shine.sourceflow.service.GenericService;

public class IPGroupTrafficTrendService extends GenericService {
	public IPGroupTrafficTrendService() {
		this.dao = new IPGroupTrafficTrendDao();
	}
}
