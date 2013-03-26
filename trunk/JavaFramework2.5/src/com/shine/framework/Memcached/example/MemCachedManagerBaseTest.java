package com.shine.framework.Memcached.example;

import com.shine.framework.Memcached.MemCachedManager;

public class MemCachedManagerBaseTest {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		MemCachedManager.getManager().addMemCachePool("cache",
				"192.168.2.212:11211");
		MemCachedManager.getManager().add("cache", "test", "test");
		System.out.println(MemCachedManager.getManager().get("cache", "test"));
	}

}
