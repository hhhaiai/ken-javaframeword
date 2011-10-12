package com.shine.AutoDiscovery.utils;

import java.util.ArrayList;
import java.util.List;

import com.shine.framework.core.util.NetworkUtils;

/**
 * ip分组分析存放容器
 * 
 * @author viruscodecn@gmail.com
 * 
 */
public class DisCoveryIpAddress extends ArrayList<String> {

	private int tag = 0;

	private int inside_tag = 0;

	private List<String> cacheList = new ArrayList<String>();

	private boolean b = true;

	/**
	 * 解析ip段
	 * 
	 * @param ipAddress
	 */
	public void parseIp(String ipAddress) {
		this.clear();
		String ipResult[] = ipAddress.split(",");
		for (String ipGroup : ipResult) {
			if (ipGroup != null && ipGroup.length() != 0) {
				this.add(ipGroup);
			}
		}
	}

	/**
	 * 获取下个需要解析的ip
	 * 
	 * @return
	 */
	public String next() {
		if (b) {
			if (tag < this.size()) {
				String s = this.get(tag);
				if (s.indexOf("-") != -1) {
					cacheList.clear();
					String ip[] = s.split("-");
					cacheList = NetworkUtils.getAllIpAddress(ip[0], ip[1]);
					inside_tag = 1;
					b = false;
					return ip[0];
				} else {
					tag++;
					return s;
				}
			}
		} else {
			if (inside_tag < cacheList.size()) {
				return cacheList.get(inside_tag++);
			} else {
				b = true;
				cacheList.clear();
				tag++;
				return next();
			}
		}
		return null;
	}
}
