package com.shine.AutoDiscovery.utils;

import java.util.ArrayList;
import java.util.List;

public class DiscoveryHelper {
	// 发现名称
	private String label;
	// 返回url
	private String returnUrl;

	// 发现类型 com.shine.AutoDiscovery.utils.DisCoveryType
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
	// 共同体容器
	private List<String> communitysList = new ArrayList<String>();
	// port列表
	private List<String> portsList = new ArrayList<String>();
	// 用户名列表
	private List<String> namesList = new ArrayList<String>();
	// 密码列表
	private List<String> passwordsList = new ArrayList<String>();

	public DiscoveryHelper() {

	}

	public DiscoveryHelper(String xmlPath) {

	}

	/**
	 * 初始化自动发现
	 * 
	 * @param ipAddress
	 * @param ports
	 * @param communitys
	 * @param names
	 * @param passwords
	 */
	public DiscoveryHelper(String ipAddress, String ports, String communitys,
			String names, String passwords) {
		this.ipAddress = ipAddress;
		this.ports = ports;
		this.communitys = communitys;
		this.names = names;
		this.passwords = passwords;

		if (this.ipAddress != null && this.ipAddress.length() != 0)
			disCoveryIpAddress.parseIp(this.ipAddress);
		// 共同体
		communitysList.clear();
		communitysList = parse(communitys);
		// 端口
		portsList.clear();
		portsList = parse(ports);
		// 用户名
		namesList.clear();
		namesList = parse(names);
		// 密码
		passwordsList.clear();
		passwordsList = parse(passwords);
	}

	public void initDiscoveryThread() {
		System.out.println("初始化发现线程");
	}

	public void cleanDisCoveryThread() {
		System.out.println("销毁发现线程");
	}

	public void startDiscovery() {
		String s = "";
		while ((s = this.disCoveryIpAddress.next()) != null) {
			System.out.println(s);
		}
	}

	public void closeDisCovery() {

	}

	/**
	 * 分析字符串
	 * 
	 * @param s
	 * @return
	 */
	private List<String> parse(String s) {
		List<String> list = new ArrayList<String>();
		String ipResult[] = s.split(",");
		for (String ipGroup : ipResult) {
			if (ipGroup != null && ipGroup.length() != 0) {
				list.add(ipGroup);
			}
		}
		return list;
	}

}
