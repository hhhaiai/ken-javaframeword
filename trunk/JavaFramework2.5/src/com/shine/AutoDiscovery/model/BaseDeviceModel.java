package com.shine.AutoDiscovery.model;

import com.shine.AutoDiscovery.utils.DeviceStatus;
import com.shine.AutoDiscovery.utils.DeviceType;

/**
 * 发现设备的基础类
 * 
 * @author viruscodecn@gmail.com
 * 
 */
public class BaseDeviceModel {
	// 设备别名
	private String label = "未知设备";
	// 设备ip
	private String ip = "0.0.0.0";
	// 设备状态
	private String deviceStatus = DeviceStatus.UNKNOW;
	// 设备类型
	private String deivceType = DeviceType.UNKNOW;

	public BaseDeviceModel() {
	}

	public BaseDeviceModel(String ip, String label, String deviceStatus,
			String deivceType) {
		this.ip = ip;
		this.label = label;
		this.deviceStatus = deviceStatus;
		this.deivceType = deivceType;
	}

	public String getLabel() {
		return label;
	}

	public void setLabel(String label) {
		this.label = label;
	}

	public String getIp() {
		return ip;
	}

	public void setIp(String ip) {
		this.ip = ip;
	}

	public String getDeviceStatus() {
		return deviceStatus;
	}

	public void setDeviceStatus(String deviceStatus) {
		this.deviceStatus = deviceStatus;
	}

	public String getDeivceType() {
		return deivceType;
	}

	public void setDeivceType(String deivceType) {
		this.deivceType = deivceType;
	}

	public String getXml() {
		return "<node label='未知设备' type='unknown' ip='0.0.0.0' />";
	}
}
