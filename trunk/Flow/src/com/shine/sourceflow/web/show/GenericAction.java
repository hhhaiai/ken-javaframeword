package com.shine.sourceflow.web.show;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.struts2.interceptor.ServletRequestAware;

import com.opensymphony.xwork2.ActionSupport;
import com.shine.DBUtil.model.DBModel;
import com.shine.sourceflow.model.show.GenericDTO;
import com.shine.sourceflow.service.show.GenericService;

/**
 * 通用ACTION
 */
public abstract class GenericAction extends ActionSupport implements ServletRequestAware {
	private static final long serialVersionUID = -7590066531210423396L;
	public static final String DATA_DEFAULT = "default";
	
	protected HttpServletRequest request;
	protected GenericService service;
	protected GenericDTO dto;
	protected Map<String, DBModel> dbModels = new HashMap<String, DBModel>();

	public GenericAction() {
		
	}
	
	public void setServletRequest(HttpServletRequest request) {
		this.request = request;
	}
	
	public GenericDTO getDto() {
		return this.dto;
	}
	
	public Map<String, DBModel> getDbModels() {
		return this.dbModels;
	}
}
