package com.shine.sourceflow.web.show.trend;

import com.shine.sourceflow.model.show.trend.ProtocolTrafficTrendDto;
import com.shine.sourceflow.service.show.trend.ProtocolTrafficTrendService;

public class ProtocolTrafficTrendAction extends TrendGenericAction {
	private static final long serialVersionUID = 9192398526313654968L;

	public ProtocolTrafficTrendAction() {
		this.dto = new ProtocolTrafficTrendDto();
		this.service = new ProtocolTrafficTrendService();
	}
	
	@Override
	protected void generateCharts() {
		
	}
}
