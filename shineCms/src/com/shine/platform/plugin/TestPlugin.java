package com.shine.platform.plugin;

import com.shine.platform.context.ConfigFactory;
import com.shine.platform.logger.ILogger;
import com.shine.platform.logger.LoggerFactory;

public class TestPlugin implements IPlugin {
	ILogger logger = LoggerFactory.getLogger(getClass());
	
	@Override
	public void destory() {
		
	}

	@Override
	public String getName() {
		return "测试插件";
	}

	@Override
	public void init() {
		logger.debug("初始化插件[" + getName() + "]");
		ConfigFactory.getFactory().registerSpringPluginXml("classpath:com/shine/platform/config/platformSpring.xml");
		ConfigFactory.getFactory().registerStrutsPluginXml(getClass().getResource("../config/platformStruts.xml").getPath());
	}

	@Override
	public void start() {
		logger.debug("启动插件[" + getName() + "]");
	}
	
}
