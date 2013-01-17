package com.shine.framework.BeanshellUtil.example;

import com.shine.framework.BeanshellUtil.BeanShellUtil;

public class Example {
	public static void main(String args[]) {
		// 无返回值直接执行代码
		BeanShellUtil.executBeanShell("System.out.println(\"123\")");

		// 带有返回值
		String s = String.valueOf(BeanShellUtil
				.executBeanShellReturn("String s=\"123\"; String result=s;"));
		System.out.println(s);
	}
}
