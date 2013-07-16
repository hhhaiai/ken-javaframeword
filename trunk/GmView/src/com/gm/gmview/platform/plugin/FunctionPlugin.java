package com.gm.gmview.platform.plugin;

public abstract class FunctionPlugin extends BasePlugin {
	// 功能中文名
	protected String functionName;

	public String getFunctionName() {
		return functionName;
	}

	public void setFunctionName(String functionName) {
		this.functionName = functionName;
	}

}
