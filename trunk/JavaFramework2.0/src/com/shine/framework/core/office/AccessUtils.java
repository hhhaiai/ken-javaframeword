package com.shine.framework.core.office;

import java.io.File;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.util.HashMap;
import java.util.Map;

import com.shine.framework.core.util.DataUtil;

public class AccessUtils {

	// mdb文件后缀
	public static final String defaultSavedMdbFileExtension = ".mdb";

	/**
	 * 连接access的mdb文件，如果没有该文件就创建
	 * 
	 * @param accessPath
	 * @return
	 * @throws Exception
	 */
	public static Connection connetAccessDB(String accessPath) throws Exception {
		Class.forName("sun.jdbc.odbc.JdbcOdbcDriver");
		String database = "jdbc:odbc:Driver={Microsoft Access Driver (*.mdb)};DBQ="
				+ accessPath + ";DriverID=22;READONLY=true}";
		return DriverManager.getConnection(database, "", "");
	}

	/**
	 * 获取access所有表名
	 * 
	 * @param filePath
	 * @return
	 */
	public static Map<String, String> selectAllTableName(String filePath) {
		if (DataUtil.isNull(filePath))
			return null;
		Map<String, String> content = null;
		Connection conn = null;
		ResultSet resultset = null;
		try {
			conn = connetAccessDB(filePath);
			DatabaseMetaData dm = conn.getMetaData();

			String[] para = new String[1];
			para[0] = "TABLE";
			resultset = dm.getTables(null, null, null, para);

			content = new HashMap<String, String>();

			int j = 0;
			while (resultset.next()) {
				content.put(String.valueOf(j), resultset.getString(3));
				j++;
			}
			resultset.close();
			conn.close();
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				if (resultset != null) {
					resultset.close();
				}

				if (conn != null) {
					conn.close();
				}
			} catch (Exception ex) {

			}
		}
		return content;
	}

	public static String readAccessTable(String filePath, String tableName)
			throws Exception {
		return null;
	}

	/**
	 * <p>
	 * Description: 删除已经存在的mdb文件
	 * </p>
	 */
	public void deleteOldMdbFile(String accessPath) throws Exception {
		File oldTargetFile = new File(accessPath);
		if (oldTargetFile.exists()) {
			oldTargetFile.delete();
		}
	}
}
