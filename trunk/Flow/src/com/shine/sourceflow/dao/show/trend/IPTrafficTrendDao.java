package com.shine.sourceflow.dao.show.trend;

import java.util.Map;

import com.shine.DBUtil.model.DBModel;
import com.shine.sourceflow.dao.show.trend.strategy.IPTrafficTrendStdQuery;

public class IPTrafficTrendDao extends TrendGenericDao {
	public IPTrafficTrendDao() {
		this.queryStrategy = new IPTrafficTrendStdQuery();
	}

	@Override
	protected Map<String, DBModel> handleDbModels(
			Map<String, DBModel> dbSrcModels, Map<String, DBModel> dbDstModels) {
		if (dbSrcModels.size() > 0) {
			return dbSrcModels;
		} else {
			return dbDstModels;
		}
	}
}
