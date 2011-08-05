package com.shine.RemoteWebServer;

public class RemoteWebServerManager {
	private static RemoteWebServerManager manager = null;

	public static RemoteWebServerManager getManager() {
		if (manager != null)
			manager = new RemoteWebServerManager();
		return manager;
	}

	public void bindWebPort(int port) {

	}

	public void bindServerPort(int port) {

	}
}
