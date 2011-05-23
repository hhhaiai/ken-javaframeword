package com.shine.framework.Udp.utils;

import java.util.HashMap;

import com.shine.framework.Udp.model.UdpReceviceIf;

public class UdpHelperMap extends HashMap<Integer, UdpSocketHelper> {
	public void putHelper(UdpSocketHelper helper) {
		if (helper != null)
			this.put(helper.getBindPort(), helper);
	}

	/**
	 * 关闭端口
	 * 
	 * @param helperName
	 */
	public void stopHelperSocket(int port) {
		this.get(port).close();
	}

	/**
	 * 加入监听
	 * 
	 * @param helperName
	 * @param udpReceviceIf
	 */
	public void addRecevice(int port, UdpReceviceIf udpReceviceIf) {
		this.get(port).addRecevice(udpReceviceIf);
	}

}
