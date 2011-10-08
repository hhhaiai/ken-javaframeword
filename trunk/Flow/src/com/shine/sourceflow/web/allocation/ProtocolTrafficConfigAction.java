package com.shine.sourceflow.web.allocation;

import com.shine.sourceflow.model.allocation.ProtocolTrafficConfigDto;
import com.shine.sourceflow.service.allocation.ProtocolTrafficConfigService;

public class ProtocolTrafficConfigAction extends ConfigGenericAction {
	private static final long serialVersionUID = 1L;

	public ProtocolTrafficConfigAction() {
		this.dto = new ProtocolTrafficConfigDto();
		this.service = new ProtocolTrafficConfigService();
	}
}
