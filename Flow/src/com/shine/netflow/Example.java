package com.shine.netflow;

import com.shine.framework.config.ConfigManager;

public class Example {
	public static void main(String args[]) {
		ConfigManager.getManager().initConfig(
				"D:\\work\\Flow\\WebRoot\\WEB-INF\\config\\boot.xml");
		ConfigManager.getManager().setConfigPath(
				"D:\\work\\Flow\\WebRoot\\WEB-INF\\config\\");
		NetFlow.getNetFlow().init();
	}
}