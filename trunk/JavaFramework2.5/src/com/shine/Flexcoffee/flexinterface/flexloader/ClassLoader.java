package com.shine.Flexcoffee.flexinterface.flexloader;

import java.lang.reflect.Method;

/**
 * load and execute java method
 * 加载执行flex的java方法
 * @author viruscodecn@gmail.com
 * @version flexcoffee 1.0
 */
public class ClassLoader {
	public Object loadMethod(String className, String method, Object[] value) {
		try {
			Object resultObject = null;
			Class h = Class.forName(className);
			Object object = h.newInstance();
			Method m[] = h.getDeclaredMethods();
			for (int i = 0; i < m.length; i++) {
				if (m[i].getName().equals(method)) {
					if (value == null) {
						resultObject = m[i].invoke(object);
					} else {
						resultObject = m[i].invoke(object, value);
					}
				}
			}
			return resultObject;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}
}
