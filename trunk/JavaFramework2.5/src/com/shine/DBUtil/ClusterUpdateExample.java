package com.shine.DBUtil;

import com.shine.DBUtil.manage.DBManager;
import com.shine.DBUtil.utils.ClusterList;

public class ClusterUpdateExample {

	/**
	 * 集群更新例子
	 * 
	 * @param args
	 */
	public static void main(String[] args) {
		System.out.println("ClusterUpdateExample...");
		DBUtil
				.getInstance()
				.init(
						"E:\\workspace\\JavaFramework2.5\\src\\com\\shine\\DBUtil\\config\\dbXml.xml");

		ClusterList list = DBManager.getInstance()
				.getClusterConnectionNameList("jdbc/Cluster");
		System.out.println("主数据库为:" + list.getMainDB());
		String sql = "insert into test1(test) value('test')";
		DBUtil.getInstance().executeClusterUpdate("jdbc/Cluster", sql);

	}

}
