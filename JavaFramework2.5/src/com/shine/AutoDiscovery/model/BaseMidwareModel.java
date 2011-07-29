package com.shine.AutoDiscovery.model;

public class BaseMidwareModel extends BaseDeviceModel {
	
	
	public BaseMidwareModel() {
		super();
	}

	public String getXml() {
		return "<node label='未知中间件设备' type='midware' ip='0.0.0.0' />";
	}
}
