package com.shine.sourceflow.utils;

import java.util.Enumeration;

import javax.servlet.http.HttpServletRequest;

public class RequestData {
	private HttpServletRequest request;
	
	public RequestData(HttpServletRequest request) {
		this.request = request;
	}
	
	public String getParaString(){
	    StringBuffer paraStr = new StringBuffer(100);
	    for (Enumeration em = request.getParameterNames(); em.hasMoreElements();) {
	    	String name = (String) (em.nextElement());
	    	if(request.getParameter(name) != null){				
				paraStr.append(name).append("=");			
				paraStr.append(request.getParameter(name));
				paraStr.append("&");
	    	}
	    }
	    if(paraStr.length() > 0)
	        paraStr.setLength(paraStr.length() - 1);
	    return paraStr.toString();
	}
}
