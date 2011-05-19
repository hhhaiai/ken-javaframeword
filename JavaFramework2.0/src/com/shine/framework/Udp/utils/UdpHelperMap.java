package com.shine.framework.Udp.utils;

import java.util.HashMap;

import com.shine.framework.Udp.model.UdpReceviceIf;

public class UdpHelperMap extends HashMap<String, UdpSocketHelper> {
	public void putHelper(UdpSocketHelper helper) {
		if (helper != null)
			this.put(helper.getHelperName(), helper);
	}

	public void stopHelperSocket(String helperName) {
		this.get(helperName).close();
	}

	public void addRecevice(String helperName, UdpReceviceIf udpReceviceIf) {
		this.get(helperName).addRecevice(udpReceviceIf);
	}
}
