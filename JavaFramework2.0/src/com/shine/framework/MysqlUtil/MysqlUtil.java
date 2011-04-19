package com.shine.framework.MysqlUtil;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.util.List;

import com.shine.framework.core.util.CmdUtil;

public class MysqlUtil {
	private static final String MYSQL_DUMP_CMD = "mysqldump\" --add-drop-table ";
	private static final String MYSQL_RECOVERY_CMD = "mysql\" -h127.0.0.1 ";

	/**
	 * dump table from database
	 * 
	 * @param tableNames
	 * @param mysqlPath
	 * @param sqlFile
	 * @param userName
	 * @param password
	 * @param dbname
	 * @return
	 */
	public static boolean dumpTables(List<String> tableNames, String mysqlPath,
			String sqlFile, String userName, String password, String dbname) {
		if (tableNames == null || tableNames.isEmpty())
			return false;

		StringBuffer cmd = new StringBuffer(100);
		if (System.getProperty("os.name").toLowerCase().indexOf("windows") != -1) {
			cmd.append("cmd.exe /c \"");
			cmd.append(mysqlPath + "bin\\");
			cmd.append(MYSQL_DUMP_CMD);
			cmd.append("-u").append(userName).append(" ");
			cmd.append("-p").append(password).append(" ");
			cmd.append(dbname).append(" ");
			for (String tn : tableNames)
				cmd.append(tn).append(" ");
			cmd.append("--result-file= \"");
			cmd.append(sqlFile);
			cmd.append("\"");
		} else {
			cmd.append("mysqldump --add-drop-table ");
			cmd.append("-u").append(userName).append(" ");
			cmd.append("-p").append(password).append(" ");
			cmd.append(dbname).append(" ");
			for (String tn : tableNames)
				cmd.append(tn).append(" ");
			cmd.append("--result-file= \"");
			cmd.append(sqlFile);
			cmd.append("\"");
		}

		try {
			CmdUtil.execute(cmd.toString());
		} catch (Exception e) {
			e.printStackTrace();
		}
		return true;
	}

	/**
	 * dump all database
	 * 
	 * @param mysqlPath
	 * @param sqlFile
	 * @param userName
	 * @param password
	 * @param dbname
	 * @return
	 */
	public static boolean dumpDataBase(String mysqlPath, String sqlFile,
			String userName, String password, String dbname) {
		StringBuffer cmd = new StringBuffer(100);
		if (System.getProperty("os.name").toLowerCase().indexOf("windows") != -1) {
			cmd.append("cmd.exe /c ");
			cmd.append("\"");
			cmd.append(mysqlPath + "bin\\");
			cmd.append(MYSQL_DUMP_CMD);
			cmd.append("-u").append(userName).append(" ");
			cmd.append("-p").append(password).append(" ");
			cmd.append(dbname).append(" ");
			cmd.append("--result-file=\"");
			cmd.append(sqlFile);
			cmd.append("\"");
		} else {
			cmd.append("mysqldump ");
			cmd.append("-h").append("127.0.0.1").append(" ");
			cmd.append("-u").append(userName).append(" ");
			cmd.append("-p").append(password).append(" ");
			cmd.append(dbname).append(" ");
			cmd.append("--lock-all-table=true").append(" ");
			cmd.append("--result-file=");
			cmd.append(sqlFile);
		}

		try {
			CmdUtil.execute(cmd.toString());
		} catch (Exception e) {
			e.printStackTrace();
		}
		return true;
	}

	/**
	 * recovery all database
	 * 
	 * @param mysqlPath
	 * @param sqlFile
	 * @param userName
	 * @param password
	 * @param dbname
	 * @return
	 */
	public static boolean recoveryDataBase(String mysqlPath, String sqlFile,
			String userName, String password, String dbname) {
		StringBuffer cmd = new StringBuffer(100);
		if (System.getProperty("os.name").toLowerCase().indexOf("windows") != -1) {
			cmd.append("cmd.exe /c \"");
			cmd.append(mysqlPath + "bin\\");
			cmd.append(MYSQL_RECOVERY_CMD);
			cmd.append("-u").append(userName).append(" ");
			cmd.append("-p").append(password).append(" ");
			cmd.append(dbname);
		} else {
			cmd.append("mysql -h127.0.0.1 ");
			cmd.append("-u").append(userName).append(" ");
			cmd.append("-p").append(password).append(" ");
			cmd.append(dbname);
		}

		OutputStream out = null;
		BufferedReader br = null;
		OutputStreamWriter writer = null;
		try {
			Runtime rt = Runtime.getRuntime();

			// 调用 mysql 的 cmd:
			Process child = rt.exec(cmd.toString());
			out = child.getOutputStream();// 控制台的输入信息作为输出流
			String inStr;
			StringBuffer sb = new StringBuffer("");
			String outStr;
			br = new BufferedReader(new InputStreamReader(new FileInputStream(
					sqlFile), "utf8"));
			while ((inStr = br.readLine()) != null) {
				sb.append(inStr + "\r\n");
			}
			outStr = sb.toString();

			writer = new OutputStreamWriter(out, "utf8");
			writer.write(outStr);
			// 注：这里如果用缓冲方式写入文件的话，会导致中文乱码，用flush()方法则可以避免
			//writer.flush();
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				out.close();
				br.close();
				writer.close();
			} catch (IOException ex) {
			}
		}
		return true;
	}

	public static void main(String args[]) {
		MysqlUtil.dumpDataBase(
				"E:\\Program Files (x86)\\MySQL\\MySQL Server 5.1\\",
				"E:\\db.db", "root", "root", "test");
	}
}
