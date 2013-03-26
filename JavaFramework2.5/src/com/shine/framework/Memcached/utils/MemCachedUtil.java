package com.shine.framework.Memcached.utils;

import com.danga.MemCached.MemCachedClient;
import com.danga.MemCached.SockIOPool;
import com.shine.framework.Memcached.MemCachedManager;

public class MemCachedUtil {

	private static boolean USE_MEMCACHE_FLAG = true;

	public static MemCachedClient getMemCachedClient(String clientName,
			String... serverlist) {
		if (USE_MEMCACHE_FLAG) {
			MemCachedClient client = null;
			SockIOPool pool = SockIOPool.getInstance();
			Integer[] weights = { 3 };
			// 设置服务器信息
			pool.setServers(serverlist);
			pool.setWeights(weights);

			// 设置初始连接数、最小和最大连接数以及最大处理时间
			pool.setInitConn(5);
			pool.setMinConn(5);
			pool.setMaxConn(250);
			pool.setMaxIdle(1000 * 60 * 60 * 6);

			// 设置主线程的睡眠时间
			pool.setMaintSleep(30);

			// 设置TCP的参数，连接超时等
			pool.setNagle(false);
			pool.setSocketTO(3000);
			pool.setSocketConnectTO(0);

			// 初始化连接池
			pool.initialize();

			client = new MemCachedClient();
			// 压缩设置，超过指定大小（单位为K）的数据都会被压缩
			client.setCompressEnable(true);
			client.setCompressThreshold(4096);
			client.setPrimitiveAsString(true);
			// client.setPoolName(clientName);
			return client;
		} else {
			return null;
		}
	}
}
