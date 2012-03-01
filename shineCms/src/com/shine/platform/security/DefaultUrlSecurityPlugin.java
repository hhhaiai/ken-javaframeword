package com.shine.platform.security;

import com.shine.platform.context.ConfigFactory;
import com.shine.platform.logger.ILogger;
import com.shine.platform.logger.LoggerFactory;
import com.shine.platform.plugin.IPlugin;

/**
 * 默认URL权限插件
 * @author JiangKunpeng 2012.02.29
 * @version 2012.02.29
 */
public class DefaultUrlSecurityPlugin implements IPlugin{
	ILogger logger = LoggerFactory.getLogger(getClass());
	
	public void destory() {
		
	}

	public String getName() {
		return "默认URL权限插件";
	}

	public void init() {
		logger.debug("初始化插件[" + getName() + "]");
		ConfigFactory.getFactory().registerSpringPluginXml("classpath:com/shine/platform/security/defaultUrlSecurityContext.xml");
		ConfigFactory.getFactory().registerStrutsPluginXml(getClass().getResource("defaultStruts.xml").getPath());
	}

	public void start() {
		logger.debug("启动插件[" + getName() + "]");
	}
	
}
