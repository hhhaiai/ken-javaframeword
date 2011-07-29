package com.shine.framework.HttpServer;

public class Example {
	public static void main(String args[]) {
		HttpServerManager manager = new HttpServerManager();
		// manager.initJettyHttpServerByWar("/ManageSystemFlex",
		// "C:\\Users\\123\\Desktop\\ManageSystemFlex.war", "8080");

		manager.initJettyHttpServer("/ManageSystemFlex",
				"E:\\workspace\\ManageSystemFlex\\WebContent", "8080");
	}
}
