package com.shine.framework.Udp.model;

import java.net.DatagramPacket;

public abstract class UdpRecevice {

	private String key;

	public abstract void recevice(String ip, int port, String data);

	public abstract void recevice(String ip, int port, byte[] data);

	public abstract void recevice(DatagramPacket packet);

	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}

}
