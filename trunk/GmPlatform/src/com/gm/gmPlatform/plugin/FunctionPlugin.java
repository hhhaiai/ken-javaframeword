package com.gm.gmPlatform.plugin;

public abstract class FunctionPlugin extends BasePlugin {
	// 功能中文�?
	protected String functionName;

	public String getFunctionName() {
		return functionName;
	}

	public void setFunctionName(String functionName) {
		this.functionName = functionName;
	}

}
