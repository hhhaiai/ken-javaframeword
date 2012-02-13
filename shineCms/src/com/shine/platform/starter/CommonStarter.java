package com.shine.platform.starter;

import javax.servlet.ServletContextEvent;

/**
 * 通用启动器,被系统监听器启动
 * @author JiangKunpeng 2012.02.l2
 * @version 2012.02.12
 *
 */
public class CommonStarter implements IStarter{
	
	public void start(Object arg) {
		ServletContextEvent event = (ServletContextEvent)arg;
	}

}
