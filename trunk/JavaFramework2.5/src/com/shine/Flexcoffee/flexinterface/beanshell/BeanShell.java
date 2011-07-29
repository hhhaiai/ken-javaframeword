package com.shine.Flexcoffee.flexinterface.beanshell;

import bsh.Interpreter;

/**
 * load and execute java code
 * 加载执行flex的java源代码
 * @author viruscodecn@gmail.com
 * @version flexcoffee 1.0
 */
public class BeanShell {
	public Object executBeanShell(String code) {
		try {
			Interpreter inter = new Interpreter();
			inter.eval(code);
			return inter.get("result");
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}
}
