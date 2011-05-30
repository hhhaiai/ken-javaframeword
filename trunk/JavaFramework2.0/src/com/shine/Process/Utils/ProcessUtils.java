package com.shine.Process.Utils;

import com.shine.framework.core.util.CmdUtil;
import com.shine.framework.core.util.DataUtil;

public class ProcessUtils {
	public static boolean killProcess(String pid) {
		if (System.getProperty("os.name").toLowerCase().indexOf("windows") != -1) {
			String result = DataUtil.gbk2utf8(CmdUtil.execute("taskkill /pid "
					+ pid + " /F"));

			if (result.length() != 0)
				return true;
		}

		return false;
	}

	public static void main(String args[]) {
		System.out.println(ProcessUtils.killProcess("5672"));
	}
}
