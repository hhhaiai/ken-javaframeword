package com.shine.framework.JarUtil;

import java.net.URL;
import java.net.URLClassLoader;

import com.shine.framework.core.util.ReflectionUtil;

/**
 * jar utilities
 * 
 * @author viruscodecn@gmail.com
 * @project JavaFramework 1.0 2011-01-11
 */
public class JarUtil extends URLClassLoader {
	public JarUtil(URL url) {
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
			Object object = JarUtil.getClassObject(jarPath, classPath);
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
			Object object = JarUtil.getClassObject(jarPath, classPath);
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
			JarUtil t = new JarUtil(url);

			Class c = t.findClass(classPath);
			return c.newInstance();
		} catch (Exception ex) {
			ex.printStackTrace();
		}
		return null;
	}
}
