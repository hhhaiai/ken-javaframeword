package com.shine.framework.Netty;

import java.util.ArrayList;
import java.util.List;

public class NettyManager {
	private static NettyManager manager = null;

	// 端口列表
	private List<Integer> ports = new ArrayList<Integer>();

	public NettyManager() {
	}

	public static NettyManager getManager() {
		if (manager == null)
			manager = new NettyManager();
		return manager;
	}

	public void startServer() {

	}

	public void stopServer() {

	}
	
}
