package com.shine.framework.HttpServer;

public class Example {
	public static void main(String args[]) {
		HttpServerManager manager = new HttpServerManager();
		manager.initJettyHttpServer("/ManageSystemFlex",
				"C:\\Users\\123\\Desktop\\ManageSystemFlex.war", "8080");
	}
}
