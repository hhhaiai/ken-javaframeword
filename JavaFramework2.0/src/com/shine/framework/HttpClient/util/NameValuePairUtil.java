package com.shine.framework.HttpClient.util;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;

import org.apache.commons.httpclient.NameValuePair;

/**
 * NameValuePairUtil
 * 
 * @author viruscodecn@gmail.com
 * @project JavaFramework 1.0 2010-11-30
 */
public class NameValuePairUtil extends HashMap {
	/**
	 * 获取httpclient post参数数组
	 * 
	 * @return
	 */
	public NameValuePair[] getNameValuePair() {
		int j = 0;
		NameValuePair[] data = new NameValuePair[this.size()];
		Set set = this.entrySet();
		Iterator i = set.iterator();
		while (i.hasNext()) {
			Map.Entry me = (Map.Entry) i.next();
			data[j] = new NameValuePair((String) me.getKey(), (String) me
					.getValue());
			j++;
		}
		return data;
	}

	/**
	 * 从url获取httpclient post参数数组
	 * 
	 * @param url
	 */
	public void setMethodUrl(String url) {
		if (url != null && url.length() != 0) {
			String p[] = url.split("&");

			for (String pa : p) {
				String d[] = pa.split("=");
				this.put(d[0], d[1]);
				d = null;
			}
		}
	}

	/**
	 * 生成httpclient get参数的url
	 * 
	 * @param url
	 * @return
	 */
	public String getMethodUrl(String url) {
		url += "?";
		Set set = this.entrySet();
		Iterator i = set.iterator();
		while (i.hasNext()) {
			Map.Entry me = (Map.Entry) i.next();
			url += (String) me.getKey() + "=" + (String) me.getValue() + "&";
		}
		return url.substring(0, url.length() - 1);
	}

	/**
	 * 从map获取httpclient参数
	 * 
	 * @param map
	 * @return
	 */
	public boolean putHashMap(Map map) {
		try {
			Set set = map.entrySet();
			Iterator i = set.iterator();
			while (i.hasNext()) {
				Map.Entry me = (Map.Entry) i.next();
				this.put(me.getKey(), me.getValue());
			}
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}
}