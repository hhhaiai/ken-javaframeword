package com.shine.framework.Ioc;

import com.shine.framework.core.util.ReflectionUtil;

public class Example {

	/**
	 * IOC工厂类使用
	 * 
	 * @param args
	 * @throws Exception
	 */
	public static void main(String[] args) throws Exception {
		IOCFactory.getFactory().addClassMap("test",
				"com.shine.framework.Ioc.Test");
		System.out.println(IOCFactory.getFactory()
				.getObject(Test.class, "test").test("123"));

	}
}
