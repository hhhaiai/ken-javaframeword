package com.shine.platform.plugin;

/**
 * 插件接口
 * @author JiangKunpeng 2012.02.12
 * @version 2012.02.12
 */
public interface IPlugin {
	
	/**
	 * 获取插件名
	 * @return
	 */
	public String getName();
	
	/**
	 * 加载
	 */
	public void init();
	
	/**
	 * 启动
	 */
	public void start();
	
	/**
	 * 销毁
	 */
	public void destory();
	
}
