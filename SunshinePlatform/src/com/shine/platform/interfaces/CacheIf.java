package com.shine.platform.interfaces;

import com.shine.platform.core.model.BaseIf;

public interface CacheIf extends BaseIf {
	/**
	 * 加入cache
	 * 
	 * @param object
	 * @param tag
	 */
	public void addCache(Object object, String... tag);

	/**
	 * 获取cache
	 * 
	 * @param tag
	 * @return
	 */
	public Object getCache(String... tag);

	/**
	 * 删除cache
	 * 
	 * @param tag
	 */
	public void removeCache(String... tag);

	public void cleanCache();
}
