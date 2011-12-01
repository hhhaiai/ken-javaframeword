package com.shine.sourceflow.service.show.trend;

import com.shine.sourceflow.dao.show.trend.AppTrafficTrendDao;
import com.shine.sourceflow.service.GenericService;

public class AppTrafficTrendService extends GenericService {
	public AppTrafficTrendService() {
		this.dao = new AppTrafficTrendDao();
	}
}
