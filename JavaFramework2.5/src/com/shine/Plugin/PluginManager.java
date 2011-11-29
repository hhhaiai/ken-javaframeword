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
		map.put(plugin.getId(), plugin);
	}

	public void sleepPlugin(String id) {
		map.get(id).sleep();
	}

	public void destroy(String id) {
		map.get(id).destroy();
		map.remove(id);
	}
}
