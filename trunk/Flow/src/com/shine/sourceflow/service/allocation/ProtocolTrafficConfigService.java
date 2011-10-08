package com.shine.sourceflow.service.allocation;

import com.shine.sourceflow.dao.allocation.ProtocolTrafficConfigDao;
import com.shine.sourceflow.service.GenericService;

public class ProtocolTrafficConfigService extends GenericService {
	public ProtocolTrafficConfigService() {
		this.dao = new ProtocolTrafficConfigDao();
	}
}
