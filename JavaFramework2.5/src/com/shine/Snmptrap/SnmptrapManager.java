package com.shine.Snmptrap;

public class SnmptrapManager {
	private static SnmptrapManager manager = null;

	public SnmptrapManager getManager() {
		if (manager == null)
			manager = new SnmptrapManager();
		return manager;
	}

	public void startRecevice(String host, int port, int cache) {

	}

	public void stopRecevice() {

	}

	public void loadTraslator() {

	}
}
