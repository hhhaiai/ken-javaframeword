package com.shine.sourceflow.dao.show.detail;

import com.shine.sourceflow.dao.show.detail.strategy.AppTrafficDetailStdQuery;

public class AppTrafficDetailDao extends DetailGenericDao {
	public AppTrafficDetailDao() {
		this.queryStrategy = new AppTrafficDetailStdQuery();
	}
}
