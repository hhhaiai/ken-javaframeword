package com.shine.sourceflow.web.allocation;

import com.shine.sourceflow.model.allocation.IPGroupConfigDto;
import com.shine.sourceflow.service.allocation.IPGroupConfigService;

public class IPGroupTrafficConfigAction extends ConfigGenericAction {
	private static final long serialVersionUID = -5105009842958493356L;
	
	public IPGroupTrafficConfigAction() {
		this.dto = new IPGroupConfigDto();
		this.service = new IPGroupConfigService();
	}
}
