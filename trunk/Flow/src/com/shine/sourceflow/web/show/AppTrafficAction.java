package com.shine.sourceflow.web.show;

import com.shine.sourceflow.model.show.AppTrafficDto;
import com.shine.sourceflow.service.show.AppTrafficService;

/**
 * 应用程序流量
 */
public class AppTrafficAction extends ShowGenericAction {
	private static final long serialVersionUID = -2996933372857471137L;
	
	public AppTrafficAction() {
		this.dto = new AppTrafficDto();
		this.service = new AppTrafficService();
	}

	@Override
	protected void generateCharts() {
				
	}
}
