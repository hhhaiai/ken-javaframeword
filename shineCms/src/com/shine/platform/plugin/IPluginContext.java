package com.shine.platform.plugin;

import java.util.Collection;

/**
 * 插件上下文
 * @author JiangKunpeng 2012.02.12
 * @version 2012.02.12
 */
public interface IPluginContext {
	/**
	 * 注入插件
	 * @param plugin
	 */
	public void registerPlugin(IPlugin plugin);
	
	/**
	 * 获取所有注册的插件
	 * @return
	 */
	public Collection<IPlugin> getAllPlugin();
}
