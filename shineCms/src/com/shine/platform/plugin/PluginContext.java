package com.shine.platform.plugin;

import java.util.ArrayList;
import java.util.List;

import com.shine.platform.logger.ILogger;
import com.shine.platform.logger.LoggerFactory;

/**
 * 插件上下文
 * @author JiangKunpeng 2012.02.12
 * @version 2013.01.31
 */
public class PluginContext{
	private static final PluginContext context = new PluginContext();
	private List<IPlugin> plugins = new ArrayList<IPlugin>();
	private ILogger logger = LoggerFactory.getLogger(getClass());
	
	private PluginContext(){
	}
	
	public static PluginContext getContext(){
		return context;
	}
	
	/**
	 * 实例化并注册插件
	 * @param pluginPath
	 */
	public void registerPlugin(String pluginPath){
		try {
			IPlugin plugin = null;
			//xml插件
			if(pluginPath.toLowerCase().endsWith(".xml")){
				plugin = new XmlPlugin(pluginPath);
			}else{	//Class插件
				Class<? extends Object> clazz = Class.forName(pluginPath);
				plugin = (IPlugin)clazz.newInstance();
			}
			registerPlugin(plugin);
		} catch (ClassNotFoundException e) {
			logger.error("找不到插件类:" + pluginPath, e);
		} catch (InstantiationException e) {
			logger.error("实例化插件异常：" + pluginPath, e);
		} catch (IllegalAccessException e) {
			logger.error("无权实例化插件：" + pluginPath, e);
		}
	}
	
	/**
	 * 注册插件
	 * @param plugin
	 */
	public void registerPlugin(IPlugin plugin){
		if(plugin.getName()==null){
			logger.error("插件注入失败,因为缺少名称：" + plugin.getClass().getName());
			return;
		}
		logger.debug("注入插件["+plugin.getName()+"->"+plugin.getClass().getName()+"]");
		for(int i=0;i<plugins.size();i++){
			IPlugin p = plugins.get(i);
			if(p.getName().equals(plugin.getName()))
				plugins.remove(i);
		}
		plugins.add(plugin);
	}
	
	/**
	 * 初始化所有插件
	 */
	public void initPlugins(){
		logger.debug("开始初始化所有插件...");
		for(IPlugin plugin:plugins){
			plugin.init();
		}
	}
	
	/**
	 * 启动所有插件
	 */
	public void startPlugins(){
		logger.debug("开始启动所有插件...");
		for(IPlugin plugin:plugins){
			plugin.start();
		}
	}

}
