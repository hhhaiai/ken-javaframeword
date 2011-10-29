package com.shine.framework.PortScan;

import java.util.List;

import com.shine.framework.PortScan.util.RemotePortScanHelper;

public class Example {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		List<Integer> list = RemoteScanManager.getManager().scanPort(
				"192.168.2.18", 0, 200);

		for (int num : list) {
			System.out.println(num);
		}
	}

}
