package com.shine.sourceflow.web.show;

import com.shine.sourceflow.model.show.IPTrafficDto;
import com.shine.sourceflow.service.show.IPTrafficService;
import com.shine.sourceflow.web.GenericAction;

/**
 * IP流量
 */
public class IPTrafficAction extends GenericAction {
	private static final long serialVersionUID = 1730268592434335250L;
	public static final String IP_SRC = "ipSrc";
	public static final String IP_DST = "ipDst";
	
	public IPTrafficAction() {
		this.dto = new IPTrafficDto();
		this.service = new IPTrafficService();
	}
}
