package com.shine.sourceflow.web.show.trend;

import com.shine.sourceflow.model.show.trend.IPTrafficTrendDto;
import com.shine.sourceflow.service.show.trend.IPTrafficTrendService;

public class IPTrafficTrendAction extends TrendGenericAction {
	private static final long serialVersionUID = -6339067387683563186L;
	
	public IPTrafficTrendAction() {
		this.dto = new IPTrafficTrendDto();
		this.service = new IPTrafficTrendService();
	}
}
