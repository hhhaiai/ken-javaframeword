package com.shine.NetAnalisys.util;

import java.util.ArrayList;
import java.util.List;

import com.shine.framework.PingUtil.PingUtil;
import com.shine.framework.core.util.NetworkUtils;

/**
 * 扫描ip
 * 
 * @author viruscodecn@gmail.com
 * 
 */
public class NetScanUtil {
	/**
	 * 扫描ip
	 * 
	 * @param startIp
	 * @param endIp
	 * @return
	 */
	public static List<String> netScan(String startIp, String endIp) {
		List<String> ipList = new ArrayList<String>();
		List<String> list = NetworkUtils.getAllIpAddress(startIp, endIp);
		for (String ip : list) {
			if (PingUtil.isReachable(ip))
				ipList.add(ip);
		}
		list = null;
		return ipList;
	}
}
