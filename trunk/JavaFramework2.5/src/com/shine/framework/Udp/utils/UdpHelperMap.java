package com.shine.framework.Udp.utils;

import java.util.HashMap;

import com.shine.framework.Udp.model.UdpRecevice;

public class UdpHelperMap extends HashMap<String, UdpSocketHelper> {
	public void putHelper(UdpSocketHelper helper) {
		if (helper != null)
			this.put(helper.getKey(), helper);
	}

	/**
	 * 关闭监听
	 * 
	 * @param helperName
	 */
	public void stopHelperSocket(int port) {
		this.get(UdpUtil.createKey("127.0.0.1", port)).close();
	}

	/**
	 * 关闭 udp 监听
	 * 
	 * @param host
	 * @param port
	 */
	public void stopHelperSocket(String host, int port) {
		this.get(UdpUtil.createKey(host, port)).close();
	}

	/**
	 * 加入监听
	 * 
	 * @param helperName
	 * @param udpReceviceIf
	 */
	public void addRecevice(int port, UdpRecevice udpReceviceIf) {
		this.get(UdpUtil.createKey("127.0.0.1", port)).addRecevice(
				udpReceviceIf);
	}

	/**
	 * 加入监听
	 * 
	 * @param host
	 * @param port
	 * @param udpReceviceIf
	 */
	public void addRecevice(String host, int port, UdpRecevice udpReceviceIf) {
		this.get(UdpUtil.createKey(host, port)).addRecevice(udpReceviceIf);
	}

}
