package com.shine.sourceflow.dao.show.trend;

import com.shine.sourceflow.dao.show.trend.strategy.IPTrafficTrendStdQuery;

public class IPTrafficTrendDao extends TrendGenericDao {
	public IPTrafficTrendDao() {
		this.queryStrategy = new IPTrafficTrendStdQuery();
	}
}
