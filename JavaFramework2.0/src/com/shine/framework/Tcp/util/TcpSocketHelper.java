package com.shine.framework.Tcp.util;

import java.net.ServerSocket;

public class TcpSocketHelper {
	public ServerSocket serveSocket = null;

	private int port;

	public void bind() throws Exception {
		serveSocket = new ServerSocket(port);
	}

	public void bind(int port) throws Exception {
		this.port = port;
		serveSocket = new ServerSocket(port);
	}

	public void receive() {

	}

	public void startRecevice() {

	}

	/**
	 * 获取运行状态
	 * 
	 * @return
	 */
	public final boolean getState() {
		if (serveSocket == null)
			return false;

		if (serveSocket.isClosed())
			return false;
		return true;
	}

	/**
	 * 关闭tcp服务端
	 */
	public final void close() {
		try {
			if (getState())
				serveSocket.close();
		} catch (Exception ex) {
			ex.printStackTrace();
		}
	}
}

class ReceviceRunnable extends Thread {
	public void run() {
		try {

		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
