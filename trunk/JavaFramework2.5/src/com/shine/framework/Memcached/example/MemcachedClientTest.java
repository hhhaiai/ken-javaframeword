package com.shine.framework.Memcached.example;

import java.util.Date;

import com.danga.MemCached.MemCachedClient;
import com.danga.MemCached.SockIOPool;

public class MemcachedClientTest {
	// 创建全局的唯一实例
	protected MemCachedClient mcc = new MemCachedClient();
	protected static MemcachedClientTest mc = new MemcachedClientTest();
	// 设置与缓存服务器的连接池
	static {
		// 服务器列表和其权重，个人memcached地址和端口号
		String[] servers = { "192.168.2.212:11211" };
		Integer[] weights = { 3 };
		// 获取socke连接池的实例对象
		SockIOPool pool = SockIOPool.getInstance();
		// 设置服务器信息
		pool.setServers(servers);
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

	}

	protected MemcachedClientTest() {

	}

	public static MemcachedClientTest getInstance() {
		return mc;
	}

	/**
	 * 添加一个指定的值到缓存中.
	 * 
	 * @param key
	 * @param value
	 * @return
	 */
	public boolean add(String key, Object value) {
		return mcc.add(key, value);
	}

	public boolean add(String key, Object value, Date expiry) {
		return mcc.add(key, value, expiry);
	}

	/**
	 * 替换一个指定的值到缓存中.
	 * 
	 * @param key
	 * @param value
	 * @return
	 */
	public boolean replace(String key, Object value) {
		return mcc.replace(key, value);
	}

	public boolean replace(String key, Object value, Date expiry) {
		return mcc.replace(key, value, expiry);
	}

	/**
	 * 删除一个指定的值到缓存中.
	 * 
	 * @param key
	 * @param value
	 * @return
	 */
	public boolean delete(String key) {
		return mcc.delete(key);
	}

	/**
	 * 根据指定的关键字获取对象.
	 * 
	 * @param key
	 * @return
	 */
	public Object get(String key) {
		return mcc.get(key);
	}

	public static void main(String[] arg) {
		MemcachedClientTest cache = MemcachedClientTest.getInstance();
		cache.add("zf", 18);
		cache.replace("zf", 19);
		//cache.delete("zf");
		System.out.println("zf get value : " + cache.get("zf"));
	}
}
