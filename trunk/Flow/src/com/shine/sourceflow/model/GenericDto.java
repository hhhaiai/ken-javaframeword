package com.shine.sourceflow.model;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

public abstract class GenericDto {
	/** 额外参数 */
	private Map<String, Object> extraParams = new HashMap<String, Object>();
	
	public abstract void init(HttpServletRequest request);
	
	public Object getExtraParams(String key) {
		return this.extraParams.get(key);
	}
	
	public void setExtraParams(String key, Object obj) {
		this.extraParams.put(key, obj);
	}
}
