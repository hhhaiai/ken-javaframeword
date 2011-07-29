package com.shine.framework.ThreadPoolUtil;

import com.shine.framework.ThreadPoolUtil.model.MethodThreadModel;

public class MethodExample {

	private String arg = "123";

	public void test() {
		System.out.println(arg);
	}

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		MethodExample e = new MethodExample();
		e.setArg("321");

		MethodThreadModel methodThreadModel = new MethodThreadModel();
		methodThreadModel.setObject(e);
		methodThreadModel.setMethodName("test");

		ThreadPoolManager.getManager().addThread(methodThreadModel);
		ThreadPoolManager.getManager().startThreadPool();

	}

	public String getArg() {
		return arg;
	}

	public void setArg(String arg) {
		this.arg = arg;
	}

}
