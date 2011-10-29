package com.shine.framework.RemoteAnalysis.util;

import java.io.IOException;
import java.net.Socket;

public class RemotePortScanHelper {
	/**
	 * 检测ip和端口是否开放
	 * 
	 * @param ipAddress
	 * @param port
	 * @return
	 */
	public boolean scanPort(String ipAddress, int port) {
		Socket testPort = null;
		try {
			if (ipAddress != null) {
				testPort = new Socket(ipAddress, port);
				testPort.setSoTimeout(10);
				return true;
			}
			return false;
		} catch (Exception e) {
			// e.printStackTrace();
			return false;
		} finally {
			try {
				if (testPort != null)
					testPort.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}
}
