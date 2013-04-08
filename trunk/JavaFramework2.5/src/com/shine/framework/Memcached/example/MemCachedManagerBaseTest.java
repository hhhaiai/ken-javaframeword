package com.shine.framework.Memcached.example;

import com.shine.framework.Memcached.MemCachedManager;

public class MemCachedManagerBaseTest {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		// 初始化集中缓存系统
		MemCachedManager.getManager().addMemCachePool("cache",
				"192.168.2.212:11211");
		// 加入指定数据到cache的集中缓存
		MemCachedManager.getManager().add("cache", "test", "test");
		// 打印获取的集中缓存数据
		System.out.println(MemCachedManager.getManager().get("cache", "test"));
		// 替换了集中缓存的数据
		MemCachedManager.getManager().replace("cache", "test", "replace");
		// 打印获取的集中缓存数据
		System.out.println(MemCachedManager.getManager().get("cache", "test"));
		// 替换了集中缓存的数据
		MemCachedManager.getManager().delete("cache", "test");
		// 打印获取的集中缓存数据
		System.out.println(MemCachedManager.getManager().get("cache", "test"));
	}

}
