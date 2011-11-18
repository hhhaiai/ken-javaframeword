package com.shine.framework.Tcp;

import java.net.ServerSocket;

/**
 * tcp连接池，包括tcp长连接
 * 
 * @author viruscodecn@gmail.com
 * 
 */
public class TcpManager {
	private static TcpManager manager = new TcpManager();

	public static TcpManager getManager() {
		return manager;
	}
}
