package com.shine.MultiProcess.utils;

public class ProcessUtils {
	/**
	 * 构建jar运行命令
	 * 
	 * @param jvmPath
	 * @param jarPath
	 * @param args
	 * @return
	 */

	public static String createJarCommon(String jvmPath, String jarPath,
			String... args) {
		StringBuffer s = new StringBuffer();
		if (System.getProperty("os.name").toLowerCase().indexOf("windows") != -1) {
			s.append("\"");
			s.append(jvmPath);
			s.append("\"");
			s.append(" ");
			s.append("-jar ");
			s.append("\"");
			s.append(jarPath);
			s.append("\"");
			s.append(" ");
			for (String arg : args) {
				s.append(arg);
				s.append(" ");
			}
		} else {

		}
		return s.toString();
	}

	public static String createClassCommon(String jvmPath, String classPath,String className,
			String... args) {
		StringBuffer s = new StringBuffer();
		if (System.getProperty("os.name").toLowerCase().indexOf("windows") != -1) {
			
		} else {

		}
		return s.toString();
	}

}
