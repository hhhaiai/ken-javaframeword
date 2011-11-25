package com.shine.sourceflow.dao.show.trend;

import java.util.Map;

import com.shine.DBUtil.model.DBModel;
import com.shine.sourceflow.dao.show.trend.strategy.ProtocolTrafficTrendStdQueryStrategy;

public class ProtocolTrafficTrendDao extends TrendGenericDao {
	public ProtocolTrafficTrendDao() {
		this.queryStrategy = new ProtocolTrafficTrendStdQueryStrategy();
	}
	
	@Override
	protected Map<String, DBModel> handleDbModels(
			Map<String, DBModel> dbSrcModels, Map<String, DBModel> dbDstModels) {
		return null;
	}
}
