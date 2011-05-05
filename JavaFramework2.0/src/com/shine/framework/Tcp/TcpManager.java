package com.shine.framework.Tcp;

public class TcpManager {
	private static TcpManager manager = new TcpManager();

	public static TcpManager getManager() {
		return manager;
	}
}
