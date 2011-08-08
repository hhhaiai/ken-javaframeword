package com.shine.sourceflow.web;

public class IPTrafficAction extends GenericAction {
	private static final long serialVersionUID = 1730268592434335250L;
	
	/** 显示的目标页面 */
	private String target;
	
	public String list() {
		this.target = "/index.jsp";
		return SUCCESS;
	}
	
	public String getTarget() {
		return this.target;
	}
}
