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
	public void addSql(String jndi, String sql) {
		if (this.containsKey(jndi)) {
			this.get(jndi).add(sql);

			if (this.get(jndi).size() > DBUtil.getInstance().getBatchSqlSize() - 1) {
				updateDB(jndi);
			}
		} else {
			ArrayList<String> list = new ArrayList<String>();
			this.put(jndi, list);
			list = null;
		}
	}

	/**
	 * 批量执行sql
	 * 
	 * @param jndi
	 */
	public void updateDB(String jndi) {
		System.out.println("批量执行sql");
		if (ThreadPoolManager.getManager().getIdleThread("dbUpdate") != null) {
			ThreadPoolManager.getManager().getIdleThread("dbUpdate").setValues(
					jndi, ((ArrayList<String>) this.get(jndi)).clone());
		} else {
			DBUtil.getInstance().autoAddBatchThread();
			DBUtil.getInstance().autoBatchCache();
		}
		this.get(jndi).clear();
	}
}
