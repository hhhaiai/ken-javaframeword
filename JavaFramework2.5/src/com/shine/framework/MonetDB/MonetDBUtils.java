package com.shine.framework.MonetDB;

import com.shine.framework.core.util.CmdUtil;

/**
 * MonetDB数据库控制器
 * 
 * @author viruscodecn@gmail.com
 * 
 */
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
