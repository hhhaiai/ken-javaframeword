package com.shine.framework.Compile;


import com.shine.framework.core.util.ReflectionUtil;
import com.sun.tools.javac.Main;

/**
 * Reflection utilities
 * 
 * @author viruscodecn@gmail.com
 * @project JavaFramework 2.0 2011-01-11
 * @lib tool.jar
 * @blog
 */
public class CompileUtils {
	/**
	 * 执行java flie
	 * 
	 * @param javaPath
	 * @param targetPath
	 * @param libPath
	 * @param classPath
	 * @param methodName
	 * @param arg
	 * @return
	 */
	public static Object executeJavaFile(String javaPath, String targetPath,
			String libPath, String classPath, String methodName, Object... arg)
			throws Exception {
		if (CompileFile(javaPath, targetPath, libPath) == 0) {
			return ReflectionUtil.invokeMethod(classPath, methodName, arg);
		}
		return null;
	}

	/**
	 * 动态编译java文件
	 * 
	 * @param javaPath
	 * @return
	 */
	@SuppressWarnings("static-access")
	public static int CompileFile(String javaPath, String targetPath,
			String libPath) {
		int status = -1;
		try {
			com.sun.tools.javac.Main javac = new Main();
			String[] arg0 = new String[] { "-d", targetPath, javaPath };
			status = javac.compile(arg0);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return status;
	}
}
