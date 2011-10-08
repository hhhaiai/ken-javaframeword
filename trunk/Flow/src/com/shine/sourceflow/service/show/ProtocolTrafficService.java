package com.shine.sourceflow.service.show;

import com.shine.sourceflow.dao.show.ProtocolTrafficDao;
import com.shine.sourceflow.service.GenericService;

public class ProtocolTrafficService extends GenericService {
	public ProtocolTrafficService() {
		this.dao = new ProtocolTrafficDao();
	}
}
