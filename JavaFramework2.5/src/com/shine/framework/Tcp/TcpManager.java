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

	/**
	 * 加入tcp监听
	 * 
	 * @param host
	 * @param port
	 * @return
	 */
	public Boolean addBind(String host, int port) {
		return false;
	}

	/**
	 * 加入tcp监听
	 * 
	 * @param port
	 * @return
	 */
	public Boolean addBind(int port) {
		return false;
	}

	/**
	 * 启动监听线程
	 */
	public void startRecevice() {

	}

	/**
	 * 启动监听线程
	 * 
	 * @param port
	 */
	public void startRecevice(int port) {

	}

	/**
	 * 所有端口暂停接收数据 抛弃数据包
	 */
	public void pauseRecevice() {

	}

	/**
	 * 指定端口暂停接收数据 抛弃相关数据包
	 * 
	 * @param port
	 */
	public void pauseRecevice(int port) {

	}
}
