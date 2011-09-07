package com.shine.framework.core.util;

import java.io.File;
import java.net.URL;
import java.net.URLClassLoader;

import com.shine.framework.core.util.ReflectionUtil;
import com.shine.framework.core.util.FileUtil;
import com.shine.framework.core.util.ZipUtil;

/**
 * jar utilities
 * 
 * @author viruscodecn@gmail.com
 * @project JavaFramework 1.0 2011-01-11
 */
public class JarLoader extends URLClassLoader {
	public JarLoader(URL url) {
		super(new URL[] { url });
	}

	/**
	 * 执行jar中class的某个方法
	 * 
	 * @param jarPath
	 * @param classPath
	 * @param methodName
	 * @param args
	 * @return
	 */
	public static Object executeJarClass(String jarPath, String classPath,
			String methodName, Object... args) {
		try {
			Object object = JarLoader.getClassObject(jarPath, classPath);
			return ReflectionUtil.invokeMethod(object, methodName, args);
		} catch (Exception ex) {
			ex.printStackTrace();
		}
		return null;
	}

	/**
	 * 执行jar的某个class的main方法
	 * 
	 * @param jarPath
	 * @param classPath
	 * @param args
	 */
	public static void executeJavaClassMainMethod(String jarPath,
			String classPath, Object... args) {
		try {
			Object object = JarLoader.getClassObject(jarPath, classPath);
			ReflectionUtil.invokeMainMethod(object, args);
		} catch (Exception ex) {
			ex.printStackTrace();
		}
	}

	/**
	 * 获取jar中某个class
	 * 
	 * @param jarPath
	 * @param classPath
	 * @return
	 */
	public static Object getClassObject(String jarPath, String classPath) {
		try {
			URL url = new URL(jarPath);
			JarLoader t = new JarLoader(url);

			Class c = t.findClass(classPath);
			return c.newInstance();
		} catch (Exception ex) {
			ex.printStackTrace();
		}
		return null;
	}

	/**
	 * 由class获取jar file
	 * 
	 * @param jarClass
	 * @return
	 */
	public static File getJarFile(Class jarClass) {
		String path = jarClass.getProtectionDomain().getCodeSource()
				.getLocation().getFile();
		try {
			path = java.net.URLDecoder.decode(path, "UTF-8");// 转换处理中文及空格
		} catch (java.io.UnsupportedEncodingException e) {
			return null;
		}
		return new File(path);
	}

	/**
	 * 获取jar file文件
	 * 
	 * @param jarClass
	 * @return
	 */
	public static String getJarName(Class jarClass) {
		File file = getJarFile(jarClass);
		if (file == null)
			return null;
		return file.getName();
	}

	/**
	 * 获取jar文件的父目录
	 * 
	 * @param jarClass
	 * @return
	 */
	public static String getJarDir(Class jarClass) {
		File file = getJarFile(jarClass);
		if (file == null)
			return null;
		return file.getParent();
	}

	/**
	 * 获取jar文件的路径
	 * 
	 * @param jarClass
	 * @return
	 */
	public static String getJarPath(Class jarClass) {
		File file = getJarFile(jarClass);
		if (file == null)
			return null;
		return file.getAbsolutePath();
	}

	public static void unZipJar(String jarPath, String targetPath) {

	}

	public static void zipJar(String classPath, String jarPath) {

	}

	public static void createMetaInfFile(String classPath, String jarPath) {

	}
}
