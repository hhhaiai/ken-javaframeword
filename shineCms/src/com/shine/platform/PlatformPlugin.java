package com.shine.platform;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.shine.platform.context.ConfigFactory;
import com.shine.platform.plugin.IPlugin;

/**
 * 平台插件
 * @author JiangKunpeng 2012.02.15
 * @version 2012.02.16
 */
public class PlatformPlugin implements IPlugin{
	Log logger = LogFactory.getLog(getClass());

	public void destory() {
	}

	public String getName() {
		return "Platform";
	}

	public void init() {
		if(logger.isInfoEnabled())
			logger.info("初始化插件[" + getName() + "]");
		ConfigFactory.getFactory().registerSpringPluginXml("classpath:com/shine/platform/platformContext.xml");
	}

	public void start() {
		if(logger.isInfoEnabled())
			logger.info("启动插件[" + getName() + "]");
	}
	
}
