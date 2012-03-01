package com.shine.platform.context;

/**
 * 项目启动器
 * @author JiangKunpeng 2012.02.12
 * @version 2012.03.01
 */
public class ProjectStarter{
	
	/**
	 * XML配置加载之前执行
	 */
	public void beforeLoadConfig(){};
	
	/**
	 * XML配置加载之后执行
	 */
	public void afterLoadConfig(){};
	
	/**
	 * 启动插件之前执行
	 */
	public void beforeStartPlugins(){};
	
	/**
	 * 启动插件之后执行
	 */
	public void afterStartPlugins(){};
	
}
