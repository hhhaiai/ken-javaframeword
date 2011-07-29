package com.shine.framework.AutoDiscovery.model;

public class IpGroupModel {
	private String ip;
	private String mask;
	private String[] port;
	private String[] community;
	private String userName;
	private String password;

	public String getIp() {
		return ip;
	}

	public void setIp(String ip) {
		this.ip = ip;
	}

	public String getMask() {
		return mask;
	}

	public void setMask(String mask) {
		this.mask = mask;
	}

	public String[] getPort() {
		return port;
	}

	public void setPort(String[] port) {
		this.port = port;
	}

	public String[] getCommunity() {
		return community;
	}

	public void setCommunity(String[] community) {
		this.community = community;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
}
