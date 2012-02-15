package com.shine.platform.context;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletContext;

/**
 * 系统配置共产
 * @author JiangKunpeng 2012.02.15
 * @version 2012.02.15
 */
final public class ConfigFactory {
	private static final ConfigFactory factory = new ConfigFactory();
	private Map<String, Object> attributes = new HashMap<String, Object>();
	private String sysPath;
	private ConfigFactory(){
	}
	
	public static ConfigFactory getFactory(){
		return factory;
	}
	
	public void init(ServletContext servletContext){
		sysPath = servletContext.getRealPath("/");
	}

	public String getSysPath() {
		return sysPath;
	}
	
	public Object getAttribute(final String name){
		return attributes.get(name);
	}
}
