package com.shine.platform.starter;

import javax.servlet.ServletContextEvent;

/**
 * 通用启动器,被系统监听器启动
 * @author JiangKunpeng
 *
 */
public class CommonStarter implements IStarter{
	
	public void start(Object arg) {
		ServletContextEvent event = (ServletContextEvent)arg;
	}

}
