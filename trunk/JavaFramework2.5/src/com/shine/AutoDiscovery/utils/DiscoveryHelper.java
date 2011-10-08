package com.shine.AutoDiscovery.utils;

public class DiscoveryHelper {
	private String label;
	private String returnUrl;

	public String type;

	// 共同体community1,community2
	public String communitys;
	// port1,port2
	public String ports;
	// name1,name2
	public String names;
	// password1,password2
	public String passwords;

	public String status = "";

	// 正在发现的状态
	public static String DISCOVERING = "discovering";
	//
	public static String COMPLETE = "complete";

	public DiscoveryHelper() {

	}

	public DiscoveryHelper(String xmlPath) {

	}

	public void init(String xmlPath) {

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
