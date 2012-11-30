package com.shine.framework.ActiveJdbc;

public class ActiveJdbcManager {
	private static ActiveJdbcManager manager = null;

	public static ActiveJdbcManager getManager() {
		if (manager == null)
			manager = new ActiveJdbcManager();
		return manager;
	}

	/**
	 * 初始化
	 * 
	 * @param path
	 */
	public void init(String path) {

	}

	/**
	 * 存入数据
	 * 
	 * @param jndiString
	 * @param tableName
	 * @param value
	 * @return
	 */
	public int saveRow(String jndiString, String tableName, String... value) {
		return 0;
	}

	/**
	 * 存入数据
	 * 
	 * @param tableName
	 * @param value
	 * @return
	 */
	public int saveRow(String tableName, String... value) {
		return 0;
	}

	/**
	 * 获取指定数据
	 * 
	 * @param tableName
	 * @param arg
	 * @return
	 */
	public Object getRow(String tableName, String arg) {
		return null;
	}

	/**
	 * 更新
	 * 
	 * @param tableName
	 * @param arg
	 * @return
	 */
	public int update(String tableName, String arg) {
		return 0;
	}

	/**
	 * 删除
	 * 
	 * @param tableName
	 * @param arg
	 * @return
	 */
	public int delete(String tableName, String arg) {
		return 0;
	}
}
