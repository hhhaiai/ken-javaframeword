package com.shine.sourceflow.web.allocation;

import com.shine.sourceflow.model.allocation.SessionTrafficConfigDto;
import com.shine.sourceflow.service.allocation.SessionTrafficConfigService;

public class SessionTrafficConfigAction extends ConfigGenericAction {
	private static final long serialVersionUID = -6768362187009189742L;

	public SessionTrafficConfigAction() {
		this.dto = new SessionTrafficConfigDto();
		this.service = new SessionTrafficConfigService();
	}
}
