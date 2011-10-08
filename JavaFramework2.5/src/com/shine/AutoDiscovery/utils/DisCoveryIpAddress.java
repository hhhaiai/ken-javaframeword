package com.shine.AutoDiscovery.utils;

import java.util.ArrayList;

/**
 * ip分组分析存放容器
 * 
 * @author viruscodecn@gmail.com
 * 
 */
public class DisCoveryIpAddress extends ArrayList<String> {
	public void parseIp(String ipAddress) {
		this.clear();
		String ipResult[] = ipAddress.split(",");
		for (String ipGroup : ipResult) {
			if (ipGroup != null && ipGroup.length() != 0) {
				this.add(ipGroup);
			}
		}
	}
}
