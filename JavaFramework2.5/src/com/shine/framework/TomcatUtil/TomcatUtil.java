package com.shine.framework.TomcatUtil;

import java.io.File;

import com.shine.framework.core.util.CmdUtil;

public class TomcatUtil {
	/**
	 * restart tomcat
	 * 
	 * @param tomcatPath
	 */
	public static void restartTomcat(String tomcatPath) {
//		CmdUtil.exeuteBatCmd("cd " + tomcatPath + File.separator + "bin",
//				tomcatPath.charAt(0) + ":", "start shutdown.bat",
//				"ping 127.0.0.1 -n 10", "start startup.bat", "exit");
//		shutdownTomcat(tomcatPath);
		CmdUtil.exeuteCmdFileNoMonitor("cmd /c start /D\""+tomcatPath+File.separator+"bin\" shutdown.bat");
		startTomcat(tomcatPath);
	}

	/**
	 * shutdown tomcat
	 * 
	 * @param tomcatPath
	 */
	public static void shutdownTomcat(String tomcatPath) {
		if (System.getProperty("os.name").toLowerCase().indexOf("windows") != -1) {
			CmdUtil.exeuteBatCmd("cd " + tomcatPath + File.separator + "bin",
					tomcatPath.charAt(0) + ":", "shutdown.bat", "exit");
//			CmdUtil.exeuteCmdFileNoMonitor("cmd /c start /D\""+tomcatPath+File.separator+"bin\" shutdown.bat");
		} else {
			CmdUtil.execute(tomcatPath + File.separator + "bin/shutdown.sh");
		}
	}

	/**
	 * start tomcat
	 * 
	 * @param tomcatPath
	 */
	public static void startTomcat(String tomcatPath) {
		if (System.getProperty("os.name").toLowerCase().indexOf("windows") != -1) {
			CmdUtil.exeuteBatCmd("cd " + tomcatPath + File.separator + "bin",
					tomcatPath.charAt(0) + ":", "startup.bat", "exit");
//			CmdUtil.exeuteCmdFileNoMonitor("cmd /c start /D\""+tomcatPath+File.separator+"bin\" startup.bat");
		} else {
			CmdUtil.execute(tomcatPath + File.separator + "bin/startup.sh");
		}
	}
}
