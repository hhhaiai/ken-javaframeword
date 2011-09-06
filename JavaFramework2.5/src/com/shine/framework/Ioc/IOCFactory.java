package com.shine.framework.Ioc;

import com.shine.framework.Ioc.utils.ClassMap;
import com.shine.framework.core.util.ReflectionUtil;

public class IOCFactory {
	private static IOCFactory factory = null;

	private ClassMap classMap = new ClassMap();

	/**
	 * 获取工厂
	 * 
	 * @return
	 */
	public static IOCFactory getFactory() {
		if (factory == null)
			factory = new IOCFactory();
		return factory;
	}

	public void init(String xmlPath) {

	}

	/**
	 * 加入工厂类库
	 * 
	 * @param className
	 * @param classPath
	 */
	public void addClassMap(String className, String classPath) {
		classMap.put(className, classPath);
	}

	/**
	 * 
	 * @param className
	 * @return
	 * @throws Exception
	 */
	public Object getObject(String className) throws Exception {
		if (classMap.containsKey(className)) {
			return ReflectionUtil.getClasstoObject(classMap.get(className));
		} else {
			System.out
					.println(this.getClass().toString() + "服务初始化" + className);
			return null;
		}
	}
}
