package com.gm.gmview.functions.ZfjlyManager;

import com.gm.gmview.framework.config.StrutsFilterDispatcher;
import com.gm.gmview.platform.plugin.FunctionPlugin;

public class ZfjlyPluginPlugin extends FunctionPlugin {

	public void regist() {
		this.pluginName = "Zfjly";
		this.functionName = "执法记录仪管理";
		this.pluginType = "function";

		// 注册mvc
		StrutsFilterDispatcher.registerXML(getClass().getResource(
				"config/zfjly.xml").getPath());
	}

	public void close() {
		// TODO Auto-generated method stub

	}

	public String getDescription() {
		// TODO Auto-generated method stub
		return null;
	}

	public void start() {
		System.out.println(functionName + "功能加载并启动!!!!");

	}

}
