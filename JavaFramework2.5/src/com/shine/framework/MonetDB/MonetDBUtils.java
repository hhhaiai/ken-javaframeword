package com.shine.framework.MonetDB;

import java.io.File;

import com.shine.framework.core.util.CmdUtil;

public class MonetDBUtils {
	/**
	 * 启动monetDB
	 * 
	 * @param monetDBPath
	 *            ="E:\\Program Files\\MonetDB\\"
	 */
	public static void startMonetDB(String monetDBPath) {
		CmdUtil.exeuteBatCmd("cd " + monetDBPath, monetDBPath.charAt(0) + ":",
				"M5server.bat", "exit");
	}

	public void stopMonetDB(String monetDBPath) {

	}
}
