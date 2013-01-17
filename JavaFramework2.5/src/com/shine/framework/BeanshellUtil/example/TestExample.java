package com.shine.framework.BeanshellUtil.example;

import com.shine.framework.BeanshellUtil.BeanShellUtil;
import com.shine.framework.BeanshellUtil.example.Test;

public class TestExample {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		// 无返回值直接执行代码
		BeanShellUtil.executBeanShell("import com.shine.framework.BeanshellUtil.example.Test; Test t=new Test(); System.out.println(t.test(\"123\"))");
	}

}
