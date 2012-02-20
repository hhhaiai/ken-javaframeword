package com.shine.framework.Cache;

import com.shine.framework.Cache.utils.CacheMap;

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
	public void addCache(Object object, String... tag) {
		map.put(createTags(tag), object);
	}

	/**
	 * 获取cache
	 * 
	 * @param tag
	 * @return
	 */
	public Object getCache(String... tag) {
		return map.get(createTags(tag));
	}

	/**
	 * 删除cache
	 * 
	 * @param tag
	 */
	public void removeCache(String... tag) {
		map.remove(createTags(tag));
	}


	/**
	 * 建造tags
	 * 
	 * @param tag
	 * @return
	 */
	protected String createTags(String... tag) {
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
	public void cleanCache() {
		map.clear();
	}
}
