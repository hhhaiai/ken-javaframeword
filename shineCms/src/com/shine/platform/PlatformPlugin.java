package com.shine.platform;

import com.shine.platform.context.ConfigFactory;
import com.shine.platform.logger.ILogger;
import com.shine.platform.logger.LoggerFactory;
import com.shine.platform.plugin.IPlugin;

/**
 * 平台插件
 * @author JiangKunpeng 2012.02.15
 * @version 2013.01.30
 */
public class PlatformPlugin implements IPlugin{
	ILogger logger = LoggerFactory.getLogger(getClass());

	public void destory() {
	}

	public String getName() {
		return "Platform";
	}

	public void init() {
		logger.debug("初始化插件[" + getName() + "]");
		ConfigFactory.getFactory().registerSpringPluginXml("classpath:com/shine/platform/platformContext.xml");
	}

	public void start() {
		logger.debug("启动插件[" + getName() + "]");
	}
	
}
