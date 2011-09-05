package com.shine.sourceflow.web.allocation;

import com.shine.sourceflow.model.allocation.AppTrafficConfigDto;
import com.shine.sourceflow.service.allocation.AppTrafficConfigService;

/**
 * 应用程序流量配置
 */
public class AppTrafficConfigAction extends ConfigGenericAction {
	private static final long serialVersionUID = -8409952121269592276L;

	public AppTrafficConfigAction() {
		this.dto = new AppTrafficConfigDto();
		this.service = new AppTrafficConfigService();
	}
}
