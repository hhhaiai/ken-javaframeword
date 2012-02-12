package com.shine.platform.plugin;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

/**
 * 插件上下文
 * @author JiangKunpeng 2012.02.12
 * @version 2012.02.12
 */
public class PluginContext implements IPluginContext{
	private List<IPlugin> plugins = new ArrayList<IPlugin>();
	
	public void registerPlugin(IPlugin plugin){
		plugins.add(plugin);
	}

	public Collection<IPlugin> getAllPlugin() {
		return plugins;
	}
}
