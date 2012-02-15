package com.shine.platform.context;

import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;

import org.springframework.web.servlet.DispatcherServlet;

public class ShineDispatcherServlet extends DispatcherServlet{
	private static final long serialVersionUID = -7723615195387218868L;
	
	private String servletName;
	private ServletContext servletContext;
	private Enumeration initParameterNames;
	private Map<String, String> params = new HashMap<String, String>();
	
	@Override
	public void init(ServletConfig config) throws ServletException {
		System.out.println("init ShineDispatcherServlet...");
//		servletName = config.getServletName();
//		servletContext = config.getServletContext();
//		initParameterNames = config.getInitParameterNames();
//		if(initParameterNames!=null){
//			String key = null;
//			while(initParameterNames.hasMoreElements()){
//				key = (String)initParameterNames.nextElement();
//				params.put(key, config.getInitParameter(key));
//			}
//		}
//		ServletConfig sc = new ServletConfig() {
//			public String getServletName() {
//				return servletName;
//			}
//			public ServletContext getServletContext() {
//				return servletContext;
//			}
//			public Enumeration getInitParameterNames() {
//				return initParameterNames;
//			}
//			public String getInitParameter(String name) {
//				return params.get(name);
//			}
//		};
		super.init(config);
	}

	@Override
	public String getInitParameter(String name) {
		return super.getInitParameter(name);
	}

	@Override
	public Enumeration getInitParameterNames() {
		return super.getInitParameterNames();
	}

	@Override
	public ServletConfig getServletConfig() {
		return super.getServletConfig();
	}
	
}
