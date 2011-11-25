package com.shine.sourceflow.service.show.trend;

import com.shine.sourceflow.dao.show.trend.ProtocolTrafficTrendDao;
import com.shine.sourceflow.service.GenericService;

public class ProtocolTrafficTrendService extends GenericService {
	public ProtocolTrafficTrendService() {
		this.dao = new ProtocolTrafficTrendDao();
	}
}
