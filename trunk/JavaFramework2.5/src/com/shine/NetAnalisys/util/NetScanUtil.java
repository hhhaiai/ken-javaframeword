package com.shine.NetAnalisys.util;

import java.util.ArrayList;
import java.util.List;

import com.shine.framework.PingUtil.PingUtil;

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
		return netScan(NetWorkUtil.seperateIpList(startIp, endIp));
	}

	/**
	 * 扫描ip
	 * 
	 * @param ips
	 * @return
	 */
	public static List<String> netScan(List<String> ips) {
		List<String> ipList = new ArrayList<String>();
		for (String ip : ips) {
			if (PingUtil.isReachable(ip))
				ipList.add(ip);
		}
		ips = null;
		return ipList;
	}
}
