package com.shine.project.shineCms;

import javax.servlet.ServletContext;

import com.shine.platform.context.ConfigFactory;
import com.shine.platform.context.ProjectStarterListener;
import com.shine.platform.logger.ILogger;
import com.shine.platform.logger.LoggerFactory;

public class ShineCmsStarterListener implements ProjectStarterListener{
	private ILogger logger = LoggerFactory.getLogger(getClass());
	
	@Override
	public void beforeLoadConfig(final ServletContext servletContext) {
		// TODO Auto-generated method stub
	}

	@Override
	public void afterLoadConfig() {
		logger.info("启动-" + ConfigFactory.getFactory().getAppName());
	}

	@Override
	public void afterStartPlugins() {
		// TODO Auto-generated method stub
	}

	@Override
	public void beforeStartPlugins() {
		// TODO Auto-generated method stub
	}

	@Override
	public void afterInitPlugins() {
		// TODO Auto-generated method stub
	}
	
}
