package com.shine.framework.Nio.model;

public abstract class NioReceiver {
	private String key;

	public NioReceiver() {
	}

	public NioReceiver(String key) {
		this.key = key;
	}

	public abstract void receive(String ip, int port, String data);

	public abstract void receive(String ip, int port, byte[] data);

	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}
}
