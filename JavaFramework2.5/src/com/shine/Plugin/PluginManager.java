package com.shine.Plugin;

import com.shine.Plugin.util.PluginMap;
import com.shine.framework.Ioc.IOCFactory;
import com.shine.framework.core.util.ReflectionUtil;
import com.shine.framework.core.util.ZipUtil;

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
		if (map.containsKey(name))
			map.get(name).sleep();
	}

	/**
	 * 删除插件
	 * 
	 * @param name
	 */
	public void destroyPlugin(String name) {
		if (map.containsKey(name)) {
			map.get(name).destroy();
			map.remove(name);
		}
	}

	/**
	 * 获取插件
	 * 
	 * @param name
	 * @return
	 */
	public Plugin getPlugin(String name) {
		if (map.containsKey(name))
			return map.get(name);
		else
			return null;
	}

	/**
	 * 获取插件
	 * 
	 * @param <T>
	 * @param interfaceClazz
	 * @param name
	 * @return
	 */
	public <T> T getPlugin(Class<T> interfaceClazz, String name) {
		if (map.containsKey(name))
			return (T) map.get(name);
		else
			return null;
	}

	/**
	 * 获取插件
	 * 
	 * @param <T>
	 * @param interfaceClazz
	 * @return
	 */
	public <T> T getPlugin(Class<T> interfaceClazz) throws Exception {
		for (Plugin p : map.values()) {
			if (ReflectionUtil.checkClassAndInterface(interfaceClazz, p)) {
				return (T) p;
			}
		}
		System.out.println("该插件没有实现:" + interfaceClazz.toString());
		return null;
	}
}
