package com.shine.AutoDiscovery.model;

public class BaseDBModel extends BaseDeviceModel {
	private int port;
	private String userName;
	private String password;

	public BaseDBModel() {
		super();
	}
	
	public String getXml() {
		return "<node label='未知数据库设备' type='db' ip='0.0.0.0' />";
	}
}
