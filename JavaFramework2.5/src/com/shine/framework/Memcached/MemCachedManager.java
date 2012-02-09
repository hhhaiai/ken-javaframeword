package com.shine.framework.Memcached;

/**
 * 集中缓存管理
 * 
 * @author viruscodecn@gmail.com
 * 
 */
public class MemCachedManager {
	private static MemCachedManager manager = null;

	public static MemCachedManager getManager() {
		if (manager == null)
			manager = new MemCachedManager();
		return manager;
	}
	
	
}
