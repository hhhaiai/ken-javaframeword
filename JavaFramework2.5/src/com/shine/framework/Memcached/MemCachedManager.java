package com.shine.framework.Memcached;

import java.util.Date;

import com.danga.MemCached.MemCachedClient;
import com.shine.framework.Memcached.utils.MemCachedPool;
import com.shine.framework.Memcached.utils.MemCachedUtil;

/**
 * 集中缓存管理
 * 
 * @author viruscodecn@gmail.com
 * @blog http://blog.csdn.net/arjick/article/details/8772666
 * 
 */
public class MemCachedManager {
	private static MemCachedManager manager = null;

	private MemCachedPool pool = new MemCachedPool();

	public static MemCachedManager getManager() {
		if (manager == null)
			manager = new MemCachedManager();
		return manager;
	}

	public MemCachedPool getPool() {
		return pool;
	}

	/**
	 * 加入新的集中缓存
	 * 
	 * @param clientName
	 * @param serverlist
	 */
	public void addMemCachePool(String clientName, String... serverlist) {
		if (!pool.containsKey(clientName)) {
			pool.put(clientName, MemCachedUtil.getMemCachedClient(clientName,
					serverlist));
		}
	}

	/**
	 * 检查集中缓存的名称
	 * 
	 * @param clientName
	 * @return
	 */
	public boolean checkCacheName(String clientName) {
		return pool.containsKey(clientName);
	}

	/**
	 * 把数据加入到指定的集中缓存
	 * 
	 * @param clientName
	 * @param key
	 * @param value
	 * @return
	 */
	public boolean add(String clientName, String key, Object value) {
		if (pool.containsKey(clientName)) {
			return pool.get(clientName).add(key, value);
		}
		return false;
	}

	public boolean add(String clientName, String key, Object value, Date expiry) {
		if (pool.containsKey(clientName)) {
			return pool.get(clientName).add(key, value, expiry);
		}
		return false;
	}

	/**
	 * 替换一个指定的值到缓存中.
	 * 
	 * @param key
	 * @param value
	 * @return
	 */
	public boolean replace(String clientName, String key, Object value) {
		if (pool.containsKey(clientName)) {
			return pool.get(clientName).replace(key, value);
		}
		return false;
	}

	/**
	 * update集中缓存的数据
	 * 
	 * @param clientName
	 * @param key
	 * @param value
	 * @param expiry
	 * @return
	 */
	public boolean replace(String clientName, String key, Object value,
			Date expiry) {
		if (pool.containsKey(clientName)) {
			return pool.get(clientName).replace(key, value, expiry);
		}
		return false;
	}

	/**
	 * 删除一个指定的值到缓存中.
	 * 
	 * @param key
	 * @param value
	 * @return
	 */
	public boolean delete(String clientName, String key) {
		if (pool.containsKey(clientName)) {
			return pool.get(clientName).delete(key);
		}
		return false;
	}
	
	public boolean deleteAll(String clientName){
		if (pool.containsKey(clientName)) {
	
			//return pool.get(clientName).
		}
		return false;
	}

	/**
	 * 根据指定的关键字获取对象.
	 * 
	 * @param key
	 * @return
	 */
	public Object get(String clientName, String key) {
		if (pool.containsKey(clientName)) {
			return pool.get(clientName).get(key);
		}
		return false;
	}

	/**
	 * 获取MemCachedClient
	 * 
	 * @param clientName
	 * @return
	 */
	public MemCachedClient getMemCachedClient(String clientName) {
		if (pool.containsKey(clientName)) {
			return pool.get(clientName);
		}
		return null;
	}
}
