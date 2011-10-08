package com.shine.sourceflow.model.allocation;

import javax.servlet.http.HttpServletRequest;

public class ProtocolTrafficConfigDto extends ConfigGenericDto {
	@Override
	public void init(HttpServletRequest request) {
		String protocolId = request.getParameter("protocolId");
		String[] protocols = request.getParameterValues("protocols");
		String protocolAlias = request.getParameter("protocolAlias");
		String ipPort = request.getParameter("ipPort");
		String perPage = request.getParameter("perPage") == null 
				? PER_PAGE : request.getParameter("perPage");
		String curPage = request.getParameter("jp") == null 
				? CUR_PAGE : request.getParameter("jp") ;
		this.setExtraParams("protocolId", protocolId);
		this.setExtraParams("protocols", protocols);
		this.setExtraParams("protocolAlias", protocolAlias);
		this.setExtraParams("ipPort", ipPort);
		this.setExtraParams("perPage", perPage);
		this.setExtraParams("curPage", curPage);
	}
}
