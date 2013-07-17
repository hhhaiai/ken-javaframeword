package com.gm.gmPlatform.web;

import com.gm.framework.web.BaseAction;
import com.gm.gmPlatform.GmPlatformManager;

public class IndexAction extends BaseAction {
	private String url;

	public String execute() throws Exception {
		this.putRequest("name", GmPlatformManager.getManager().getPluginMap()
				.getPlugin().getProjectName());
		this.url = "/project/test/login.jsp";
		return SUCCESS;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

}