package com.shine.framework.Udp.model;

public abstract class UdpReceviceIf {

	private String key;

	public abstract void recevice(String ip, int port, String data);

	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}

}
