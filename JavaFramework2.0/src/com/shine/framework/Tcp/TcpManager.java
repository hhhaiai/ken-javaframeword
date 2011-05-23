package com.shine.framework.Tcp;

import java.net.ServerSocket;

public class TcpManager {
	private static TcpManager manager = new TcpManager();

	public static TcpManager getManager() {
		return manager;
	}
}
