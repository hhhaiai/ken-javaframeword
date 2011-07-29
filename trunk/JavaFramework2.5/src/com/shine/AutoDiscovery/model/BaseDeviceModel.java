package com.shine.AutoDiscovery.model;

public class BaseDeviceModel {
	private String label = "未知设备";
	private String ip = "0.0.0.0";

	public String getXml() {
		return "<node label='未知设备' type='unknown' ip='0.0.0.0' />";
	}
}
