package com.shine.Snmptrap;

import com.shine.Snmptrap.utils.SnmptrapMap;

public class SnmptrapManager {
	private static SnmptrapManager manager = null;

	private SnmptrapMap map = new SnmptrapMap();

	public static SnmptrapManager getManager() {
		if (manager == null)
			manager = new SnmptrapManager();
		return manager;
	}

	public void addRecevice(String tag, String host, int port, int threadSize) {

	}

	public void stopRecevice(String tag) {

	}

	public void loadTraslator() {

	}
}
