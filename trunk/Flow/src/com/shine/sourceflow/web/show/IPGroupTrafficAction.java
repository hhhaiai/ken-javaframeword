package com.shine.sourceflow.web.show;

import com.shine.sourceflow.model.show.IPGroupTrafficDto;
import com.shine.sourceflow.service.show.IPGroupTrafficService;
import com.shine.sourceflow.web.GenericAction;

public class IPGroupTrafficAction extends GenericAction {
	private static final long serialVersionUID = 2814554595496949874L;

	public IPGroupTrafficAction() {
		this.dto = new IPGroupTrafficDto();
		this.service = new IPGroupTrafficService();
	}
}
