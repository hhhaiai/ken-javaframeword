package com.shine.sourceflow.service.show;

import com.shine.sourceflow.dao.show.AppTrafficDao;
import com.shine.sourceflow.service.GenericService;

public class AppTrafficService extends GenericService {
	public AppTrafficService() {
		this.dao = new AppTrafficDao();
	}
}
