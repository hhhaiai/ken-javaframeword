package com.shine.sourceflow.model.show;

import javax.servlet.http.HttpServletRequest;

import com.shine.sourceflow.web.show.IPTrafficAction;

/**
 * IP流量
 */
public class IPTrafficDTO extends GenericDTO {
	@Override
	public void init(HttpServletRequest request) {
		super.init(request);
		String flag = request.getParameter("ipType");
		this.setExtraParams(IPTrafficAction.IP_SRC, flag);
	}
}
