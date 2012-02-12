package com.shine.platform.context;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import org.springframework.context.ApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.shine.platform.starter.IStarter;

/**
 * 系统监听器
 * @author JiangKunpeng 2012.02.12
 * @version 2012.02.12
 */
public class AppListener implements ServletContextListener{
	
	public void contextInitialized(ServletContextEvent event) {
		ApplicationContext springContext = WebApplicationContextUtils.getWebApplicationContext(event.getServletContext());
		IStarter starter = (IStarter)springContext.getBean("starter");
		starter.start(event);
	}

	public void contextDestroyed(ServletContextEvent event) {
		
	}

}
