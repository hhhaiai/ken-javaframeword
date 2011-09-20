package com.shine.sourceflow.dao.show.detail;

import com.shine.sourceflow.dao.show.detail.strategy.IPTrafficDetailStdQuery;

public class IPTrafficDetailDao extends DetailGenericDao {
	public IPTrafficDetailDao() {
		this.queryStrategy = new IPTrafficDetailStdQuery();
	}
}
