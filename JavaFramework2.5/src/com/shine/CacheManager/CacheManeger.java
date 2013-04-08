package com.shine.CacheManager;

/**
 * 三级缓存，内存缓存、db4o缓存及集中缓存
 * 
 * @author viruscodencn@gmail.com
 * 
 */
public class CacheManeger {
	private static CacheManeger manager = null;

	public static CacheManeger getManager() {
		if (manager == null)
			manager = new CacheManeger();
		return manager;
	}

	/**
	 * 加入新的集中缓存
	 * 
	 * @param clientName
	 * @param serverlist
	 */
	public void addMemCachePool(String clientName, String... serverlist) {

	}

	public boolean add(String clientName, String key, Object value) {
		return false;
	}
}
