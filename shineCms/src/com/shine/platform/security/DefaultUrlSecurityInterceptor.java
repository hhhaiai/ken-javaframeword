package com.shine.platform.security;

import javax.servlet.http.HttpServletRequest;

import org.apache.struts2.ServletActionContext;

import com.opensymphony.xwork2.ActionInvocation;
import com.opensymphony.xwork2.interceptor.AbstractInterceptor;
import com.shine.common.sysmgr.entity.SysFreeUrl;
import com.shine.framework.entity.PersistResult;
import com.shine.platform.context.ConfigFactory;
import com.shine.platform.security.auth.FunctionUrl;

/**
 * 默认URL权限拦截器
 * @author JiangKunpeng 2012.02.29
 * @version 2012.02.29
 */
public class DefaultUrlSecurityInterceptor extends AbstractInterceptor{

	private static final long serialVersionUID = 7676294474119408460L;
	
	private UrlSecurityContext urlSecurityContext;

	@Override
	public String intercept(ActionInvocation invocation) throws Exception {
		HttpServletRequest request = ServletActionContext.getRequest();
		String uri = request.getRequestURI();
		String appContext = ConfigFactory.getFactory().getAppContext();
		int idx = uri.indexOf(appContext);
		if(idx!=-1){
			uri = uri.substring(idx+appContext.length());
		}
		SysFreeUrl freeUrl = urlSecurityContext.getFreeUrl(uri);
		PersistResult pr = null;
		if(freeUrl==null){
			FunctionUrl furl = urlSecurityContext.getUrl(uri);
			if(furl==null){
				System.out.println("没有权限："+uri);
			}else{
				System.out.println(furl.getFunction().getMenu().getMenuName()+"-"+furl.getFunction().getFunName());
			}
		}
		return invocation.invoke();
	}

	public void setUrlSecurityContext(UrlSecurityContext urlSecurityContext) {
		this.urlSecurityContext = urlSecurityContext;
	}
	
}
