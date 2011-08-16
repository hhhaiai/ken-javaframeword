package com.shine.sourceflow.web.show;

import javax.servlet.http.HttpServletRequest;

import org.apache.struts2.interceptor.ServletRequestAware;

import com.opensymphony.xwork2.ActionSupport;
import com.shine.sourceflow.model.show.GenericDTO;
import com.shine.sourceflow.service.show.GenericService;

/**
 * 通用ACTION
 */
public abstract class GenericAction extends ActionSupport implements ServletRequestAware {
	private static final long serialVersionUID = -7590066531210423396L;
	
	protected HttpServletRequest request;
	protected GenericService service;
	protected GenericDTO dto;
	
	public GenericAction() {
		
	}
	
	public void setServletRequest(HttpServletRequest request) {
		this.request = request;
	}
	
	public GenericDTO getDto() {
		return dto;
	}
}
