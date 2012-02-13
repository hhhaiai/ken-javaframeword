package com.shine.platform.context;

import java.util.Enumeration;

import javax.servlet.ServletConfig;

import org.springframework.web.servlet.DispatcherServlet;

public class ShineDispatcherServlet extends DispatcherServlet{
	private static final long serialVersionUID = -7723615195387218868L;

	@Override
	public String getInitParameter(String name) {
		System.out.println("111111");
		return super.getInitParameter(name);
	}

	@Override
	public Enumeration getInitParameterNames() {
		System.out.println("2222222");
		return super.getInitParameterNames();
	}

	@Override
	public ServletConfig getServletConfig() {
		System.out.println("33333333");
		return super.getServletConfig();
	}
	
}
