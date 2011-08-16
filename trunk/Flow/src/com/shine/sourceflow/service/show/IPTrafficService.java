package com.shine.sourceflow.service.show;

import com.shine.sourceflow.dao.show.IPTrafficDao;

/**
 * IP流量
 */
public class IPTrafficService extends GenericService {
	public IPTrafficService() {
		this.dao = new IPTrafficDao();
	}
}
