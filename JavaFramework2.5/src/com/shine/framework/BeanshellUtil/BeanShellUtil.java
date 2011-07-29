package com.shine.framework.BeanshellUtil;

import bsh.Interpreter;

public class BeanShellUtil {
	/**
	 * 执行String
	 * 
	 * @param code
	 * @return
	 */
	public static Object executBeanShellReturn(String code) {
		try {
			Interpreter inter = new Interpreter();
			inter.eval(code);
			return inter.get("result");
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	/**
	 * 执行String
	 * 
	 * @param code
	 */
	public static void executBeanShell(String code) {
		try {
			Interpreter inter = new Interpreter();
			inter.eval(code);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
