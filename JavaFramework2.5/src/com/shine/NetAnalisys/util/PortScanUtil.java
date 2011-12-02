package com.shine.NetAnalisys.util;

import java.util.ArrayList;
import java.util.List;

import com.shine.framework.PortScan.util.RemotePortScanHelper;

public class PortScanUtil {
	/**
	 * 扫描端口 从maxPort到minPort
	 * 
	 * @param ip
	 * @param maxPort
	 * @param minPort
	 * @return
	 */
	public static List<Integer> scanPort(String ip, int minPort, int maxPort) {
		RemotePortScanHelper helper = new RemotePortScanHelper();
		List<Integer> list = new ArrayList<Integer>();
		for (int i = minPort; i <= maxPort; i++) {
			if (helper.scanPort(ip, i)) {
				list.add(i);
			}
		}
		helper = null;
		return list;
	}
}
