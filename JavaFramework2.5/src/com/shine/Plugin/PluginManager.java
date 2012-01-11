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

	public void loadPlugin(Plugin plugin) {
		plugin.start();
		map.put(plugin.getName(), plugin);
	}

	public void sleepPlugin(String name) {
		map.get(name).sleep();
	}

	public void destroy(String name) {
		map.get(name).destroy();
		map.remove(name);
	}

}
