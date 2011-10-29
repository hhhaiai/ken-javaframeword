package com.shine.framework.RemoteAnalysis;

import java.util.ArrayList;
import java.util.List;

import com.shine.framework.RemoteAnalysis.util.RemotePortScanHelper;

public class RemoteAnalysisManager {
	private static RemoteAnalysisManager manager = null;

	public static RemoteAnalysisManager getManager() {
		if (manager == null)
			manager = new RemoteAnalysisManager();
		return manager;
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
		RemotePortScanHelper helper = new RemotePortScanHelper();
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
