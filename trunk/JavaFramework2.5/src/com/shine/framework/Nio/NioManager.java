package com.shine.framework.Nio;

import com.shine.framework.Nio.utils.NioHelper;
import com.shine.framework.Nio.utils.NioHelperMap;

public class NioManager {
	private static NioManager manager = null;

	private NioHelperMap map = new NioHelperMap();

	public static NioManager getManger() {
		if (manager == null)
			manager = new NioManager();
		return manager;
	}

	public void createNioServer(int port) {

	}

	public void closeNioServer(int port) {

	}

	public NioHelper getHelper(int port) {
		return map.get(port);
	}
}
