package com.gm.gmPlatform.util;

import java.util.HashMap;

import com.gm.gmPlatform.plugin.BaseProjectPlugin;
import com.gm.gmPlatform.plugin.IPlugin;

/**
 * 插件容器
 * 
 * @author viruscodecn@gmail.com
 * 
 */
public class PluginMap extends HashMap<String, IPlugin> {
	private BaseProjectPlugin plugin;

	public BaseProjectPlugin getPlugin() {
		return plugin;
	}

	public void setPlugin(BaseProjectPlugin plugin) {
		this.plugin = plugin;
	}

}
