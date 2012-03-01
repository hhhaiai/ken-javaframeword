package com.shine.project.shineCms;

import com.shine.platform.context.ProjectStarter;
import com.shine.platform.logger.ILogger;
import com.shine.platform.logger.LoggerFactory;

public class ShineCmsStarter extends ProjectStarter{
	private ILogger logger = LoggerFactory.getLogger(getClass());
	
	@Override
	public void beforeLoadConfig() {
		logger.info("启动阳光CMS");
	}
	
}
