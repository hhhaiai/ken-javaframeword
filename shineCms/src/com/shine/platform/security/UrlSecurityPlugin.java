package com.shine.platform.security;

import com.shine.platform.context.ConfigFactory;
import com.shine.platform.logger.ILogger;
import com.shine.platform.logger.LoggerFactory;
import com.shine.platform.plugin.IPlugin;

public class UrlSecurityPlugin implements IPlugin{
	ILogger logger = LoggerFactory.getLogger(getClass());

	@Override
	public void destory() {
	}

	@Override
	public String getName() {
		return "URL权限控制";
	}

	@Override
	public void init() {
		logger.debug("初始化插件[" + getName() + "]");
		ConfigFactory.getFactory().registerSpringXml("classpath:com/shine/platform/security/config/urlSecuritySpring.xml");
	}

	@Override
	public void start() {
		logger.debug("启动插件[" + getName() + "]");
		UrlSecurityContext usc = (UrlSecurityContext)ConfigFactory.getFactory().getSpringContext().getBean("urlSecurityContext");
		usc.init();
	}
	
}
