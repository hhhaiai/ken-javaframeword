package com.shine.NetAnalisys.model;

import java.util.ArrayList;

public class NetScanCallBack {
	public void callback(ArrayList<String> list) {
		for (String ip : list) {
			System.out.println("IP地址:" + ip + " ping通");
		}
	}
}
