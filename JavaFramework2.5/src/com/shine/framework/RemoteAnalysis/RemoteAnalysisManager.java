package com.shine.framework.RemoteAnalysis;

import java.util.ArrayList;
import java.util.List;

import com.shine.framework.RemoteAnalysis.util.RemotePortScanHelper;

public class RemoteAnalysisManager {
	private static RemoteAnalysisManager manager = null;

	private RemotePortScanHelper helper = new RemotePortScanHelper();

	public static RemoteAnalysisManager getManager() {
		if (manager == null)
			manager = new RemoteAnalysisManager();
		return manager;
	}

	/**
	 * 测试远程端口是否开启
	 * 
	 * @param ip
	 * @param port
	 * @return
	 */
	public boolean testRemotePort(String ip, int port) {
		return helper.scanPort(ip, port);
	}

	/**
	 * 扫描端口 从maxPort到minPort
	 * 
	 * @param ip
	 * @param maxPort
	 * @param minPort
	 * @return
	 */
	public List<Integer> scanPort(String ip, int minPort, int maxPort) {
		List<Integer> list = new ArrayList<Integer>();
		for (int i = minPort; i <= maxPort; i++) {
			if (helper.scanPort(ip, i)) {
				list.add(i);
			}
		}
		return list;
	}

	/**
	 * 扫描所有端口
	 * 
	 * @param ip
	 * @return
	 */
	public List<Integer> scanAllPort(String ip) {
		return scanPort(ip, 0, 65535);
	}

}
