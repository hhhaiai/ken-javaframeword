package com.shine.DBUtil.model;

import java.util.HashMap;

public class DBRowModel extends HashMap<String, String> {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * 获取行的值
	 * 
	 * @param key
	 * @return
	 */
	public String getString(String key) {
		if (this.get(key) == null)
			return "";
		return this.get(key);
	}
}
