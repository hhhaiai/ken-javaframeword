package com.shine.framework.Lealone.Example;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class TeseBaseSqlLealon {

	/**
	 * @param args
	 */
	public static void main(String[] args) throws Exception {
		Connection conn;
		Statement stmt;
		ResultSet rs;
		String db = "hbasedb";
		String url = "jdbc:lealone:tcp://192.168.2.212:10000/default";

		conn = DriverManager.getConnection(url, "sa", "");
		stmt = conn.createStatement();
		
		rs = stmt.executeQuery("select * from test");

		int n = rs.getMetaData().getColumnCount();
		while (rs.next()) {
			for (int i = 1; i <= n; i++) {
				System.out.print(rs.getString(i) + " ");
			}
			System.out.println();
		}
		rs.close();
		rs = null;

	}
}