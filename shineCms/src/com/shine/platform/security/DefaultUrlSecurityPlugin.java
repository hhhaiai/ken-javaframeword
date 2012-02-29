package com.shine.platform.security;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.shine.platform.context.ConfigFactory;
import com.shine.platform.plugin.IPlugin;

/**
 * 默认URL权限插件
 * @author JiangKunpeng 2012.02.29
 * @version 2012.02.29
 */
public class DefaultUrlSecurityPlugin implements IPlugin{
	Log logger = LogFactory.getLog(getClass());
	
	public void destory() {
		
	}

	public String getName() {
		return "默认URL权限插件";
	}

	public void init() {
		if(logger.isDebugEnabled())
			logger.debug("初始化插件[" + getName() + "]");
		ConfigFactory.getFactory().registerSpringPluginXml("classpath:com/shine/platform/security/defaultUrlSecurityContext.xml");
		ConfigFactory.getFactory().registerStrutsPluginXml(getClass().getResource("defaultStruts.xml").getPath());
	}

	public void start() {
		if(logger.isDebugEnabled())
			logger.debug("启动插件[" + getName() + "]");
	}
	
}
