package com.shine.framework.QQ.weibo;

/**
 * 腾讯微博入口类
 * 
 * @author viruscodecn@gmail.com
 * 
 */
public class WeiboManager {
	private static WeiboManager manager = null;

	public static WeiboManager getManager() {
		if (manager == null)
			manager = new WeiboManager();
		return manager;
	}
}
