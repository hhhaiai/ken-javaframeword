package com.gm.gmPlatform.plugin;

/**
 * 插件抽象�?
 * 
 * @author viruscodecn@gmail.com
 * 
 */
public abstract class BasePlugin implements IPlugin {
	protected String pluginName;
	// project、function
	protected String pluginType;
	// run、stop
	protected String pluginState;

	public void init() {
		regist();
		//System.out.println(pluginName + "注册完成");
	}

	public String getPluginName() {
		return pluginName;
	}

	public void setPluginName(String pluginName) {
		this.pluginName = pluginName;
	}

	public String getPluginType() {
		return pluginType;
	}

	public void setPluginType(String pluginType) {
		this.pluginType = pluginType;
	}

	public String getPluginState() {
		return pluginState;
	}

}
