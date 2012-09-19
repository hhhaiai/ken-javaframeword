package com.shine.framework.config;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import com.shine.sourceflow.Sourceflow;

/**
 * Tomcat启动时调用,加载系统基本配置
 */
public class ConfigListener implements ServletContextListener {
	public void contextInitialized(ServletContextEvent event) {
		// 初始化配置
		ConfigManager.getManager().init(event.getServletContext());
		Sourceflow.getSourceflow().init();
	}
	
	public void contextDestroyed(ServletContextEvent event) {
		Sourceflow.getSourceflow().destroy();
	}
}
