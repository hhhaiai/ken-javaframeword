package com.shine.sourceflow.model.allocation;

import javax.servlet.http.HttpServletRequest;

public class IPGroupConfigDto extends ConfigGenericDto {
	@Override
	public void init(HttpServletRequest request) {
		String groupId = request.getParameter("groupId");
		String[] groupIds = request.getParameterValues("ipGroups");
		String ipAlias = request.getParameter("ipAlias");
		String ipStartAddress = request.getParameter("ipStartAddress");
		String ipEndAddress = request.getParameter("ipEndAddress");
		String perPage = request.getParameter("perPage") == null 
				? PER_PAGE : request.getParameter("perPage");
		String curPage = request.getParameter("jp") == null 
				? CUR_PAGE : request.getParameter("jp") ;
		this.setExtraParams("groupId", groupId);
		this.setExtraParams("groupIds", groupIds);
		this.setExtraParams("ipAlias", ipAlias);
		this.setExtraParams("ipStartAddress", ipStartAddress);
		this.setExtraParams("ipEndAddress", ipEndAddress);
		this.setExtraParams("perPage", perPage);
		this.setExtraParams("curPage", curPage);
	}
}
