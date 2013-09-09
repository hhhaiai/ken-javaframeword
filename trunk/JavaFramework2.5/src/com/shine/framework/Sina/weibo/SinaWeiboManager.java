package com.shine.framework.Sina.weibo;

/**
 * 新浪围脖入口类
 * 
 * @author viruscodecn@gmail.com
 * 
 */
public class SinaWeiboManager {
	private static SinaWeiboManager manager = null;

	public static SinaWeiboManager getManager() {
		if (manager == null)
			manager = new SinaWeiboManager();
		return manager;
	}
}
