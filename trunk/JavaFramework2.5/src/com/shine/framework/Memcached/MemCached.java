package com.shine.framework.Memcached;

import java.util.Date;
import com.danga.MemCached.MemCachedClient;
import com.danga.MemCached.SockIOPool;

public class MemCached {
	// 创建全局的唯一实例
	private static MemCachedClient mcc = new MemCachedClient();

	private static MemCached memCached = new MemCached();

	static {
		// 设置与缓存服务器的链接池
		String[] servers = { "127.0.0.1:11211" };
		Integer[] weights = { 3 };

		// 获得socke连接池的实例对象
		SockIOPool pool = SockIOPool.getInstance();

		// 设置服务器信息
		pool.setServers(servers);
		pool.setWeights(weights);

		// 设置初始化连接数,最小何最大连接数以及最大处理时间
		pool.setInitConn(5);
		pool.setMinConn(5);
		pool.setMaxConn(250);
		pool.setMaxIdle(1000 * 60 * 60);
		// 设置主线程的睡眠时间
		pool.setMaintSleep(30);

		// 设置TCP的参数,连接超时等
		pool.setNagle(false);
		pool.setSocketTO(3000);
		pool.setSocketConnectTO(0);

		// 初始化连接池
		pool.initialize();

		// 压缩设置,超过指定大小(单位为K)的数据都会被压缩
		mcc.setCompressEnable(true);
		mcc.setCompressThreshold(64 * 1024);
	}

	// 保护构造方法,不允许实例化
	protected MemCached() {
	}

	// 获得唯一实例
	public static MemCached getInstance() {
		return memCached;
	}

	public static void set(String name, Object value, Date expire) {
		mcc.set(name, value, expire);
	}

	public static Object get(String name) {
		return mcc.get(name);
	}

	public static Object delete(String name) {
		return mcc.delete(name);
	}

	// 添加一个方法来测试一把!!!
	public static Object set(String key, Object value) {
		return mcc.add(key, value);
	}

	public static void main(String[] args) {
		MemCached cache = MemCached.getInstance();
		cache.set("Hello", 234);
		System.out.print("value:" + cache.get("Hello"));
	}
}
