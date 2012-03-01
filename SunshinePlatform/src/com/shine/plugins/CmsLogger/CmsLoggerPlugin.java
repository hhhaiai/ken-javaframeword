package com.shine.plugins.CmsLogger;

import com.shine.Plugin.Plugin;
import com.shine.Plugin.util.PluginTypes;
import com.shine.platform.interfaces.LoggerIf;

public class CmsLoggerPlugin extends Plugin implements LoggerIf {

	public CmsLoggerPlugin() {
		this.initPlugin("CmsLogger", "1.0", PluginTypes.CLASSPATH, "",
				"CmsLogger");
	}

	@Override
	protected void pluginDestroy() {
		// TODO Auto-generated method stub

	}

	@Override
	protected void pluginSleep() {
		// TODO Auto-generated method stub

	}

	@Override
	protected void pluginStart() {
		// TODO Auto-generated method stub

	}

	public void initLoggerFilePath() {
		// TODO Auto-generated method stub

	}

	public String log(Exception e) {
		// TODO Auto-generated method stub
		return null;
	}

	public String log(String err) {
		// TODO Auto-generated method stub
		return null;
	}

	public Plugin getPlugin() {
		return this;
	}

	public String pluginStatus() {
		return this.getStatus();
	}

}
