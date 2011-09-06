package com.shine.DBUtil.model;

import java.util.HashMap;
import java.util.Iterator;

import com.shine.DBUtil.DBUtil;

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

	/**
	 * 获取delete条件
	 * 
	 * @return
	 */
	public String toDeleteSql() {
		StringBuffer sql = new StringBuffer();
		Iterator it = this.keySet().iterator();
		while (it.hasNext()) {
			String key = it.next().toString();
			String value = this.get(key);
			sql.append(key);
			sql.append("='");
			sql.append(value);
			sql.append("' ");
			value = null;
			key = null;
		}
		return sql.toString();
	}

	public int update(String column, String value) {

		return 0;
	}

	public int delete() {
		// return DBUtil.getInstance().executeUpdate(jndi,
		// createDeleteSql(this.toDeleteSql()));
		return 0;
	}
}
