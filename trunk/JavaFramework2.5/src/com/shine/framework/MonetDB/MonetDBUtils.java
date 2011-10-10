package com.shine.framework.MonetDB;

import java.io.File;

import com.shine.framework.core.util.CmdUtil;

public class MonetDBUtils {
	/**
	 * 启动monetDB
	 * 
	 * @param monetDBPath
	 *            ="E:\\Program Files\\MonetDB\\MonetDB5\\"
	 */
	public static void startMonetDB(String monetDBPath) {
		CmdUtil.exeuteBatCmd("cd " + monetDBPath, monetDBPath.charAt(0) + ":",
				"M5server.bat", "exit");
	}

	/**
	 * 关闭MonetDB
	 * 
	 * @param monetDBPath
	 */
	public static void stopMonetDB(String monetDBPath) {

	}

	/**
	 * 重启MonetDB
	 * 
	 * @param monetDBPath
	 */
	public static void restartMonetDB(String monetDBPath) {

	}

	/**
	 * 测试MonetDB
	 */
	public static void testMonetDB() {

	}

}
