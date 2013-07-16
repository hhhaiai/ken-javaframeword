package com.gm.gmview.platform.plugin;

/**
 * 插件接口
 * 
 * @author viruscodecn@gmail.com
 * 
 */
public interface IPlugin {
	public void init();

	public void regist();

	public void start();

	public void close();

	public String getPluginName();

	public String getPluginType();

	public String getPluginState();

	public String getDescription();
}
