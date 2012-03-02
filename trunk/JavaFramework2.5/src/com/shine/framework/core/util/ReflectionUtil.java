package com.shine.framework.core.util;

import java.lang.reflect.Constructor;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;
import java.rmi.RemoteException;

/**
 * Reflection utilities
 * 
 * @author viruscodecn@gmail.com
 * @project JavaFramework 1.0 2011-01-11
 */
public class ReflectionUtil {
	/**
	 * 获取class对象
	 * 
	 * @param classPath
	 * @return
	 * @throws Exception
	 */
	public static Object getClasstoObject(String classPath) throws Exception {
		return Class.forName(classPath).newInstance();
	}

	/**
	 * 获取class
	 * 
	 * @param classPath
	 * @return
	 * @throws Exception
	 */
	public static Class<?> getClass(String classPath) throws Exception {
		return Class.forName(classPath);
	}

	/**
	 * 获取某个对象的属性 如果这个属性是非公有的，这里会报IllegalAccessException
	 * 
	 * @param object
	 * @param fieldName
	 * @return
	 * @throws Exception
	 */
	public static Object getProperty(Object object, String fieldName)
			throws Exception {
		Class objectClass = object.getClass();
		Field field = objectClass.getField(fieldName);
		Object property = field.get(object);
		return property;
	}

	/**
	 * 获取所有构造方法
	 * 
	 * @param className
	 * @return
	 * @throws Exception
	 */
	public static Constructor[] getAllConstructorByClassName(String className)
			throws Exception {
		return Class.forName(className).getConstructors();
	}

	/**
	 * 获取一个class所有方法通过class路径
	 * 
	 * @param className
	 * @return
	 * @throws Exception
	 */
	public static Method[] getAllMethodByClassName(String className)
			throws Exception {
		Class cls = Class.forName(className);
		return cls.getDeclaredMethods();
	}

	/**
	 * 获取一个object所有方法数组
	 * 
	 * @param object
	 * @return
	 * @throws Exception
	 */
	public static Method[] getAllMethodByObject(Object object) throws Exception {
		Class cls = object.getClass();
		return cls.getDeclaredMethods();
	}

	/**
	 * 从class path获取class某个静态属性
	 * 
	 * @param className
	 * @param fieldName
	 * @return
	 * @throws Exception
	 */
	public static Object getStaticProperty(String className, String fieldName)
			throws Exception {
		Class objectClass = Class.forName(className);
		Field field = objectClass.getField(fieldName);
		Object property = field.get(objectClass);
		return property;
	}

	/**
	 * 反射某个class的方法
	 * 
	 * @param classPath
	 * @param methodName
	 * @param args
	 * @return
	 * @throws Exception
	 */
	public static Object invokeMethod(String classPath, String methodName,
			Object... args) throws Exception {
		return invokeMethod(getClasstoObject(classPath), methodName, args);
	}

	/**
	 * 执行某对象的方法
	 * 
	 * @param object
	 * @param methodName
	 * @param args
	 * @return
	 * @throws Exception
	 */
	public static Object invokeMethod(Object object, String methodName,
			Object... args) throws Exception {
		Class objectClass = object.getClass();
		if (args == null) {
			Method method = objectClass.getMethod(methodName);
			return method.invoke(object);
		}

		Class[] argsClass = new Class[args.length];
		for (int i = 0, j = args.length; i < j; i++) {
			argsClass[i] = args[i].getClass();
		}
		Method method = objectClass.getMethod(methodName, argsClass);
		return method.invoke(object, args);
	}

	/**
	 * 执行另外一个class的main方法
	 * 
	 * @param object
	 * @param args
	 * @throws Exception
	 */
	public static void invokeMainMethod(Object object, Object[] args)
			throws Exception {
		Class objectClass = object.getClass();
		Class[] argsClass = new Class[args.length];
		for (int i = 0, j = args.length; i < j; i++) {
			argsClass[i] = args[i].getClass();
		}
		Method method = objectClass.getMethod("main", argsClass);
		method.invoke(null, args);
	}

	/**
	 * 执行class中的静态方法
	 * 
	 * @param className
	 * @param args
	 * @return
	 * @throws Exception
	 */
	public static Object newInstance(String className, Object[] args)
			throws Exception {
		Class newoneClass = Class.forName(className);
		Class[] argsClass = new Class[args.length];
		for (int i = 0, j = args.length; i < j; i++) {
			argsClass[i] = args[i].getClass();
		}
		Constructor cons = newoneClass.getConstructor(argsClass);
		return cons.newInstance(args);
	}

	/**
	 * 给予接口反射注入
	 * 
	 * @param <T>
	 * @param interfaceClazz
	 * @param obj
	 * @return
	 */
	public static <T> T getAOPBean(Class<T> interfaceClazz, final T obj)
			throws RemoteException {
		assert interfaceClazz.isInterface();

		return (T) Proxy.newProxyInstance(interfaceClazz.getClassLoader(),
				new Class[] { interfaceClazz }, new AopInvocationHandlerImpl(
						obj));
	}

	/**
	 * 给予接口反射注入
	 * 
	 * @param obj
	 * @return
	 */
	public static Object getAOPBean(final Object obj) throws RemoteException {
		return Proxy.newProxyInstance(obj.getClass().getClassLoader(), obj
				.getClass().getInterfaces(), new AopInvocationHandlerImpl(obj));
	}

	/**
	 * 检查该object是否实现了该interface
	 * 
	 * @param cls
	 * @param o
	 * @return
	 */
	public static boolean checkClassAndInterface(Class<?> cls, Object o) {
		Class<?> objectClass = o.getClass();
		return checkClassAndInterface(cls, objectClass);
	}

	/**
	 * 检查该class是否实现了该interface
	 * 
	 * @param cls
	 * @param objectClass
	 * @return
	 */
	public static boolean checkClassAndInterface(Class<?> cls,
			Class<?> objectClass) {
		if (cls.isAssignableFrom(objectClass) && !cls.equals(objectClass)) {
			return true;
		}
		return false;
	}
}
