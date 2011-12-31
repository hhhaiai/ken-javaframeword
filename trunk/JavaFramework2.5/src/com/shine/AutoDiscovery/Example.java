package com.shine.AutoDiscovery;

import com.shine.AutoDiscovery.utils.DiscoveryHelper;

public class Example {

	/**
	 * 自动发现例子
	 * 
	 * @param args
	 */
	public static void main(String[] args) {
		DiscoveryHelper helper = new DiscoveryHelper(
				"10.144.199.1,192.168.1.1-192.168.1.10", "3306,10086", "", "", "");

		helper.startDiscovery();

	}

}
