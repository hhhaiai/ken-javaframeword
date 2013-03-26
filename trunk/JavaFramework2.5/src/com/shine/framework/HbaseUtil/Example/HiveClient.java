package com.shine.framework.HbaseUtil.Example;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class HiveClient {
	public static void main(String[] args) throws Exception {
		Class.forName("org.apache.hadoop.hive.jdbc.HiveDriver");
		String dropSQL = "drop table test";
		String createSQL = "create table test (key int, value string)";
		// hive插入数据支持两种方式一种：load文件，令一种为从另一个表中查询进行插入（感觉这是个鸡肋）
		// hive是不支持insert into...values(....)这种操作的
		String insterSQL = "LOAD DATA LOCAL INPATH '/home/kv1.txt' OVERWRITE INTO TABLE test";
		String querySQL = "SELECT a.* FROM test a";

		Connection con = DriverManager.getConnection(
				"jdbc:hive://192.168.2.212:10000/default", "", "");
		Statement stmt = con.createStatement();
		stmt.executeQuery(dropSQL); // 执行删除语句
		stmt.executeQuery(createSQL); // 执行建表语句
		stmt.executeQuery(insterSQL); // 执行插入语句
		ResultSet res = stmt.executeQuery(querySQL); // 执行查询语句

		while (res.next()) {
			System.out.println("Result: key:" + res.getString(1)
					+ "  –>  value:" + res.getString(2));
		}
	}
}
