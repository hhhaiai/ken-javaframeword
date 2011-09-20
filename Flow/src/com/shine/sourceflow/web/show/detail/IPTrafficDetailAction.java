package com.shine.sourceflow.web.show.detail;

import com.shine.sourceflow.model.show.detail.IPTrafficDetailDto;
import com.shine.sourceflow.service.show.detail.IPTrafficDetailService;

public class IPTrafficDetailAction extends DetailGenericAction {
	private static final long serialVersionUID = 7154281456097066937L;
	
	public IPTrafficDetailAction() {
		this.dto = new IPTrafficDetailDto();
		this.service = new IPTrafficDetailService();
	}
}
