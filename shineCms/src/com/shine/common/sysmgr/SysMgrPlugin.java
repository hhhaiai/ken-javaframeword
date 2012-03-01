package com.shine.common.sysmgr;

import com.shine.platform.context.ConfigFactory;
import com.shine.platform.logger.ILogger;
import com.shine.platform.logger.LoggerFactory;
import com.shine.platform.plugin.IPlugin;

/**
 * 系统管理插件
 * @author JiangKunpeng 2012.03.01
 * @version 2012.03.01
 */
public class SysMgrPlugin implements IPlugin{
	ILogger logger = LoggerFactory.getLogger(getClass());
	
	@Override
	public void destory() {
	}

	@Override
	public String getName() {
		return "系统管理";
	}

	@Override
	public void init() {
		logger.debug("初始化插件[" + getName() + "]");
		ConfigFactory.getFactory().registerSpringPluginXml("classpath:com/shine/common/sysmgr/config/sysmgrContext.xml");
		ConfigFactory.getFactory().registerStrutsPluginXml(getClass().getResource("config/sysmgrStruts.xml").getPath());
	}

	@Override
	public void start() {
		logger.debug("启动插件[" + getName() + "]");
	}
	
}
