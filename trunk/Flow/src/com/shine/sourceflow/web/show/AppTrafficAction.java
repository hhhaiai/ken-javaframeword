package com.shine.sourceflow.web.show;

import com.shine.sourceflow.model.show.AppTrafficDto;
import com.shine.sourceflow.service.show.AppTrafficService;
import com.shine.sourceflow.web.GenericAction;

/**
 * 应用程序流量
 */
public class AppTrafficAction extends GenericAction {
	private static final long serialVersionUID = -2996933372857471137L;
	
	public AppTrafficAction() {
		this.dto = new AppTrafficDto();
		this.service = new AppTrafficService();
	}
}
