package com.shine.DBUtil;

import com.shine.DBUtil.model.DBModel;

public class ClusterSelectExample {

	/**
	 * 集群查询
	 * 
	 * @param args
	 */
	public static void main(String[] args) {
		System.out.println("ClusterSelectExample...");
		DBUtil
				.getInstance()
				.init(
						"E:\\workspace\\JavaFramework2.5\\src\\com\\shine\\DBUtil\\config\\dbXml.xml");

		String sql = "select * from test1";
		String clusterJndi = "jdbc/Cluster";
		DBModel dbmodel1 = DBUtil.getInstance().executeClusterQuery(
				clusterJndi, sql);

		DBModel dbmodel2 = DBUtil.getInstance().executeClusterQuery(
				clusterJndi, sql);

	}

}
