package com.shine.netflow;

import com.shine.sourceflow.config.ConfigManager;

public class Example {
	public static void main(String args[]) {
		ConfigManager.getManager().initConfig(
				"E:\\workspace\\Flow\\WebRoot\\WEB-INF\\config\\boot.xml");
		ConfigManager.getManager().setConfigPath(
				"E:\\workspace\\Flow\\WebRoot\\WEB-INF\\config\\");
		NetFlow flow = new NetFlow();
		flow.init();
	}
}