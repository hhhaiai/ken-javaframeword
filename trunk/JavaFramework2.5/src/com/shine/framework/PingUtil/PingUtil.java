package com.shine.framework.PingUtil;

import java.net.InetAddress;

/**
 * ping数据测试联通性
 * 
 * @author viruscodecn@gmail.com
 * 
 */
public class PingUtil {
	/**
	 * ping测试
	 * 
	 * @param ip
	 * @param timeout
	 * @return
	 */
	public static boolean isReachable(String ip, int timeout) {
		try {
			InetAddress address = InetAddress.getByName(ip);
			return address.isReachable(timeout);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return false;
	}

	/**
	 * ping测试
	 * 
	 * @param ip
	 * @return
	 */
	public static boolean isReachable(String ip) {
		return isReachable(ip, 5000);
	}
}
