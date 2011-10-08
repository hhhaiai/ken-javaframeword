package com.shine.AutoDiscovery.utils;

public class DiscoveryHelper {
	// 发现名称
	private String label;
	// 返回url
	private String returnUrl;

	// 发现类型 com.shine.AutoDiscovery.utils.DeviceType
	public String type;

	// 发现状态 com.shine.AutoDiscovery.utils.DisCoveryStatus
	public String status;

	// 检索的ip地址 ip="192.168.1.1,192.168.2.1-291.168.2.125"
	public String ipAddress;
	// 共同体community1,community2
	public String communitys;
	// port1,port2
	public String ports;
	// name1,name2
	public String names;
	// password1,password2
	public String passwords;

	// ip分组存放容器
	private DisCoveryIpAddress disCoveryIpAddress = new DisCoveryIpAddress();

	public DiscoveryHelper() {

	}

	public DiscoveryHelper(String xmlPath) {

	}

	public DiscoveryHelper(String ipAddress, String ports, String communitys,
			String names, String passwords) {
		this.ipAddress = ipAddress;
		this.ports = ports;
		this.communitys = communitys;
		this.names = names;
		this.passwords = passwords;

		disCoveryIpAddress.parseIp(this.ipAddress);
	}

	public void initDiscoveryThread() {
		System.out.println("初始化发现线程");
	}

	public void cleanDisCoveryThread() {
		System.out.println("销毁发现线程");
	}

	public void startDiscovery() {

	}

	public void closeDisCovery() {

	}

}
