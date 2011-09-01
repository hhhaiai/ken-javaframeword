package com.shine.sourceflow.service.show;

import com.shine.sourceflow.dao.show.IPTrafficDao;
import com.shine.sourceflow.service.GenericService;

/**
 * IP流量
 */
public class IPTrafficService extends GenericService {
	public IPTrafficService() {
		this.dao = new IPTrafficDao();
	}
}
