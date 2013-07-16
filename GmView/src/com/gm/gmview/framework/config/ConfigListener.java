package com.gm.gmview.framework.config;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import com.gm.gmview.platform.PlatformManager;

public class ConfigListener implements ServletContextListener {

	public void contextInitialized(ServletContextEvent arg0) {
		try {
			System.out.println("=============平台初始化=================");
			PlatformManager.getManager().init(arg0.getServletContext());
			System.out.println("=============平台启动完成=================");
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void contextDestroyed(ServletContextEvent arg0) {
		try {

		} catch (Exception e) {
			e.printStackTrace();
		} finally {

		}
	}

}
