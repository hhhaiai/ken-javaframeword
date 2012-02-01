package com.shine.Plugin;

import com.shine.Plugin.util.PluginMap;

/**
 * 插件管理类
 * 
 * @author viruscodecn@gmail.com
 * 
 */
public class PluginManager {
	private static PluginManager manager = null;

	private PluginMap map = new PluginMap();

	public static PluginManager getManager() {
		if (manager == null)
			manager = new PluginManager();
		return manager;
	}

	/**
	 * 载入插件
	 * 
	 * @param plugin
	 */
	public void loadPlugin(Plugin plugin) {
		plugin.start();
		map.put(plugin.getName(), plugin);
	}

	/**
	 * 休眠插件
	 * 
	 * @param name
	 */
	public void sleepPlugin(String name) {
		map.get(name).sleep();
	}

	/**
	 * 删除插件
	 * 
	 * @param name
	 */
	public void destroy(String name) {
		map.get(name).destroy();
		map.remove(name);
	}

}
