package com.shine.platform.context;

import java.util.EventListener;

import javax.servlet.ServletContext;

/**
 * 项目启动监听器
 * @author JiangKunpeng 2012.02.12
 * @version 2012.11.22
 */
public interface ProjectStarterListener extends EventListener{
	
	/**
	 * XML配置加载之前执行
	 */
	public void beforeLoadConfig(final ServletContext servletContext);
	
	/**
	 * XML配置加载之后(初始化插件前)执行
	 */
	public void afterLoadConfig();
	
	/**
	 * 初始化插件之后执行
	 */
	public void afterInitPlugins();
	
	/**
	 * 启动插件之前执行
	 */
	public void beforeStartPlugins();
	
	/**
	 * 启动插件之后执行
	 */
	public void afterStartPlugins();
	
}
