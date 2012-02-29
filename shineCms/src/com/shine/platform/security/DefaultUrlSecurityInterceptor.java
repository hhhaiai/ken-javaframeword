package com.shine.platform.security;

import javax.servlet.http.HttpServletRequest;

import org.apache.struts2.ServletActionContext;

import com.opensymphony.xwork2.ActionInvocation;
import com.opensymphony.xwork2.interceptor.AbstractInterceptor;

/**
 * 默认URL权限拦截器
 * @author JiangKunpeng 2012.02.29
 * @version 2012.02.29
 */
public class DefaultUrlSecurityInterceptor extends AbstractInterceptor{

	private static final long serialVersionUID = 7676294474119408460L;

	@Override
	public String intercept(ActionInvocation invocation) throws Exception {
		HttpServletRequest request = ServletActionContext.getRequest();
		String uri = request.getRequestURI();
		System.out.println("url:"+uri);
		return invocation.invoke();
	}
	
}
