package com.shine.sourceflow.config;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import com.shine.netflow.NetFlow;

/**
 * Tomcat启动时调用,加载系统基本配置
 */
public class ConfigListener implements ServletContextListener {
	public void contextInitialized(ServletContextEvent event) {
		// 初始化配置
		ConfigManager.getManager().init(event.getServletContext());
		System.out.println("[" + ConfigManager.getManager().
				getAttribute("version").getText() + "]Starting");
		// 启动netflow接收器
		NetFlow.getInstance().init();
	}
	
	public void contextDestroyed(ServletContextEvent event) {
		
	}
}
