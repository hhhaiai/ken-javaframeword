package com.shine.sourceflow.model.allocation;

import javax.servlet.http.HttpServletRequest;

public class SessionTrafficConfigDto extends ConfigGenericDto {
	@Override
	public void init(HttpServletRequest request) {
		String sessionId = request.getParameter("sessionId");
		String[] sessions = request.getParameterValues("sessions");
		String sessionAlias = request.getParameter("sessionAlias");
		String firstIp = request.getParameter("firstIp");
		String secondIp = request.getParameter("secondIp");
		String perPage = request.getParameter("perPage") == null 
				? PER_PAGE : request.getParameter("perPage");
		String curPage = request.getParameter("jp") == null 
				? CUR_PAGE : request.getParameter("jp") ;
		this.setExtraParams("sessionId", sessionId);
		this.setExtraParams("sessions", sessions);
		this.setExtraParams("sessionAlias", sessionAlias);
		this.setExtraParams("firstIp", firstIp);
		this.setExtraParams("secondIp", secondIp);
		this.setExtraParams("perPage", perPage);
		this.setExtraParams("curPage", curPage);
	}
}
