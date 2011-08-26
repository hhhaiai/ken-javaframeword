package com.shine.DBUtil.utils;

import java.util.ArrayList;
import java.util.HashMap;
import com.shine.DBUtil.DBUtil;
import com.shine.framework.ThreadPoolUtil.ThreadPoolManager;

/**
 * 缓存提交sql容器
 * 
 * @author viruscodecn@gmail.com
 * 
 */
@SuppressWarnings("serial")
public class BatchMap extends HashMap<String, ArrayList<String>> {
	/**
	 * 缓存sql
	 * 
	 * @param jndi
	 * @param sql
	 */
	@SuppressWarnings("unchecked")
	public void addSql(String jndi, String sql) {
		if (this.containsKey(jndi)) {
			this.get(jndi).add(sql);

			if (this.get(jndi).size() > DBUtil.getInstance().getBatchSqlSize() - 1) {
				ArrayList<String> list = (ArrayList<String>) this.get(jndi)
						.clone();
				updateDB(jndi, list);
				this.get(jndi).clear();
			}
		} else {
			this.put(jndi, new ArrayList<String>());
			addSql(jndi, sql);
		}
	}

	/**
	 * 批量提交数据
	 * 
	 * @param jndi
	 * @param list
	 */
	public void updateDB(String jndi, ArrayList<String> list) {
		System.out.println("批量执行sql");
		if (ThreadPoolManager.getManager().getIdleThread("dbUpdate") != null) {
			ThreadPoolManager.getManager().getIdleThread("dbUpdate").setValues(
					jndi, list);
		} else {
			DBUtil.getInstance().autoAddBatchThread();
			DBUtil.getInstance().autoBatchCache();
		}
	}

	/**
	 * 批量执行sql
	 * 
	 * @param jndi
	 */
	@SuppressWarnings("unchecked")
	public void updateDB(String jndi) {
		if (this.containsKey(jndi)) {
			this.updateDB(jndi, (ArrayList<String>) this.get(jndi).clone());
			this.get(jndi).clear();
		}
	}
}
