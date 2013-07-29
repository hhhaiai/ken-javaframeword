package com.shine.framework.Cache;

import com.shine.framework.Cache.utils.CacheMap;

/**
 * 缓存类
 * 
 * @author viruscodecn@gmail.com
 * 
 */
public class CacheManager {
	private static CacheManager manager = new CacheManager();

	private CacheMap map = new CacheMap();

	public static CacheManager getManager() {
		return manager;
	}

	/**
	 * 加入cache
	 * 
	 * @param object
	 * @param tag
	 */
	public synchronized void addCache(Object object, String... tag) {
		map.put(createTags(tag), object);
	}

	/**
	 * 获取cache
	 * 
	 * @param tag
	 * @return
	 */
	public synchronized Object getCache(String... tag) {
		return map.get(createTags(tag));
	}

	/**
	 * 获取批量
	 * 
	 * @param tag
	 * @return
	 */
	public synchronized CacheMap getCaches(String... tag) {
		CacheMap m = new CacheMap();
		for (String key : map.keySet()) {
			boolean b = true;
			for (String tagData : tag) {
				if (key.indexOf(tagData) == -1) {
					b = false;
					break;
				}
			}
			if (b)
				m.put(key, map.get(key));
		}
		return m;
	}

	/**
	 * 获取String类型的cache
	 * 
	 * @param tag
	 * @return
	 */
	public synchronized String getString(String... tag) {
		return String.valueOf(createTags(tag));
	}

	/**
	 * 删除cache
	 * 
	 * @param tag
	 */
	public synchronized void removeCache(String... tag) {
		map.remove(createTags(tag));
	}

	/**
	 * 加入其他缓存
	 * 
	 * @param value
	 */
	public synchronized void addCacheMap(CacheMap value) {
		map.putAll(value);
	}

	/**
	 * 建造tags
	 * 
	 * @param tag
	 * @return
	 */
	private String createTags(String... tag) {
		String tags = "";
		for (String tagdata : tag) {
			if (tags.length() == 0)
				tags = tagdata;
			else
				tags = tags + ";" + tagdata;
		}
		return tags;
	}

	/**
	 * 清空cache
	 */
	public synchronized void cleanCache() {
		map.clear();
	}

	public CacheMap getMap() {
		return map;
	}

	public void setMap(CacheMap map) {
		this.map = map;
	}

}
