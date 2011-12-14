package com.shine.framework.Udp.utils;

public class UdpUtil {
	/**
	 * 生成udp池的key
	 * @param host
	 * @param port
	 * @return
	 */
	public static String createKey(String host, int port) {
		return host + "_" + String.valueOf(port);
	}
}
