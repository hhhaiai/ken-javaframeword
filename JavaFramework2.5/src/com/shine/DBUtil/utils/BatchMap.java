package com.shine.DBUtil.utils;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.shine.DBUtil.DBUtil;
import com.shine.framework.ThreadPoolUtil.ThreadPoolManager;

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

			if (this.get(jndi).size() > DBUtil.getInstance().getBatchSqlSize()) {
				System.out.println("批量执行sql");
				ArrayList<String> list = this.get(jndi);
				if (ThreadPoolManager.getManager().getIdleThread("dbUpdate") != null) {
					ThreadPoolManager.getManager().getIdleThread("dbUpdate")
							.setValues(jndi,
									((ArrayList) this.get(jndi)).clone());
				}
				this.get(jndi).clear();
			}
		} else {
			ArrayList<String> list = new ArrayList<String>();
			this.put(jndi, list);
			list = null;
		}
	}
}
