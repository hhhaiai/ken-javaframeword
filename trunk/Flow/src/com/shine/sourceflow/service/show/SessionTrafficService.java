package com.shine.sourceflow.service.show;

import com.shine.sourceflow.dao.show.SessionTrafficDao;
import com.shine.sourceflow.service.GenericService;

public class SessionTrafficService extends GenericService {
	public SessionTrafficService() {
		this.dao = new SessionTrafficDao();
	}
}
