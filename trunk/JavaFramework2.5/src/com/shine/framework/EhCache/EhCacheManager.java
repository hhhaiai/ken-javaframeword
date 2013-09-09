package com.shine.framework.EhCache;

import net.sf.ehcache.Cache;

public class EhCacheManager {
	private static EhCacheManager manager = null;

	private Cache cache;

	public static EhCacheManager getManager() {
		if (manager == null)
			manager = new EhCacheManager();
		return manager;
	}

	public boolean put(String key, Object o) {
		return false;
	}

	public Object get(String key) {
		return null;
	}

}
