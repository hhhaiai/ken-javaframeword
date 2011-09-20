package com.shine.sourceflow.web.show.detail;

import com.shine.sourceflow.model.show.detail.AppTrafficDetailDto;
import com.shine.sourceflow.service.show.detail.AppTrafficDetailService;

public class AppTrafficDetailAction extends DetailGenericAction {
	private static final long serialVersionUID = -9161883542935361242L;

	public AppTrafficDetailAction() {
		this.dto = new AppTrafficDetailDto();
		this.service = new AppTrafficDetailService();
	}
}
