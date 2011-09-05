package com.shine.sourceflow.model.allocation;

import javax.servlet.http.HttpServletRequest;

public class AppTrafficConfigDto extends ConfigGenericDto {
	@Override
	public void init(HttpServletRequest request) {
		String appId = request.getParameter("appId");
		String[] appIds = request.getParameterValues("appIds");
		String appAlias = request.getParameter("appAlias");
		String ipPort = request.getParameter("ipPort");
		String ipAddress = request.getParameter("ipAddress");
		String perPage = request.getParameter("perPage") == null 
				? PER_PAGE : request.getParameter("perPage");
		String curPage = request.getParameter("jp") == null 
				? CUR_PAGE : request.getParameter("jp") ;
		this.setExtraParams("appId", appId);
		this.setExtraParams("appIds", appIds);
		this.setExtraParams("appAlias", appAlias);
		this.setExtraParams("ipPort", ipPort);
		this.setExtraParams("ipAddress", ipAddress);
		this.setExtraParams("perPage", perPage);
		this.setExtraParams("curPage", curPage);
	}
}
