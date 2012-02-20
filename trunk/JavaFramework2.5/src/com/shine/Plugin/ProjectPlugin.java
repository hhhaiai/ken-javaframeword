package com.shine.Plugin;

import com.shine.Plugin.util.PluginStatus;

public abstract class ProjectPlugin extends Plugin {

	protected void start() {
		System.out.println("=============插件:" + this.name
				+ "为项目插件正常启动,并且加载相关项目插件=============");
		pluginStart();
		this.status = PluginStatus.RUN;
	}

	protected void sleep() {
		System.out.println("=============插件:" + this.name
				+ "为项目插件，无法休眠=============");
	}

	protected void destroy() {
		System.out.println("=============插件:" + this.name
				+ "为项目插件，无法销毁=============");
	}

	@Override
	protected void pluginDestroy() {
		// TODO Auto-generated method stub
	}

	@Override
	protected void pluginSleep() {
		// TODO Auto-generated method stub
	}
}
