package com.shine.NetAnalisys.model;

import java.util.ArrayList;

public class NetPortCallBack {
	public void callback(ArrayList<Integer> list) {
		for (int port : list) {
			System.err.println("IP端口:" + port + " 开通");
		}
	}
}
