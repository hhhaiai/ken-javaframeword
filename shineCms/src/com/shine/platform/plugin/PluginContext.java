package com.shine.platform.plugin;

import java.util.HashMap;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

/**
 * 插件上下文
 * @author JiangKunpeng 2012.02.12
 * @version 2012.02.15
 */
public class PluginContext{
	private static final PluginContext context = new PluginContext();
	private Map<String, IPlugin> plugins = new HashMap<String, IPlugin>();
	private Log logger = LogFactory.getLog(getClass());
	
	private PluginContext(){
	}
	
	public static PluginContext getContext(){
		return context;
	}
	
	/**
	 * 实例化并注册插件
	 * @param className
	 */
	public void registerPlugin(String className){
		try {
			Class<? extends Object> clazz = Class.forName(className);
			IPlugin plugin = (IPlugin)clazz.newInstance();
			registerPlugin(plugin);
		} catch (ClassNotFoundException e) {
			logger.error("找不到插件类:" + className, e);
		} catch (InstantiationException e) {
			logger.error("实例化插件异常：" + className, e);
		} catch (IllegalAccessException e) {
			logger.error("无权实例化插件：" + className, e);
		}
	}
	
	/**
	 * 注册插件
	 * @param plugin
	 */
	public void registerPlugin(IPlugin plugin){
		if(logger.isDebugEnabled())
			logger.debug("注入插件["+plugin.getName()+"-"+plugin.getClass().getName()+"]");
		plugins.put(plugin.getName(),plugin);
	}
	
	/**
	 * 初始化所有插件
	 */
	public void initPlugins(){
		if(logger.isDebugEnabled())
			logger.debug("开始初始化所有插件...");
		for(IPlugin plugin:plugins.values()){
			plugin.init();
		}
	}
	
	/**
	 * 启动所有插件
	 */
	public void startPlugins(){
		if(logger.isDebugEnabled())
			logger.debug("开始启动所有插件...");
		for(IPlugin plugin:plugins.values()){
			plugin.start();
		}
	}

}
