package com.shine.platform.plugin;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

import com.shine.platform.context.ConfigFactory;

/**
 * 插件上下文
 * @author JiangKunpeng 2012.02.12
 * @version 2012.02.15
 */
public class PluginContext{
	private static final PluginContext context = new PluginContext();
	Map<String, IPlugin> plugins = new HashMap<String, IPlugin>();
	
	private PluginContext(){
	}
	
	public static PluginContext getContext(){
		return context;
	}
	
	/**
	 * 初始化插件
	 * @param event
	 */
	public void init(){
		String sysPath = ConfigFactory.getFactory().getSysPath();
	}
	
	/**
	 * 注册插件
	 * @param plugin
	 */
	public void registerPlugin(IPlugin plugin){
		plugins.put(plugin.getName(),plugin);
	}

	/**
	 * 获取到所有注册的插件
	 * @return
	 */
	public Collection<IPlugin> getPlugins() {
		return plugins.values();
	}
}
