package com.shine.framework.Fetion;

public class Example {

	/**
	 * 登陆例子
	 * 
	 * @param args
	 * @throws Exception
	 */
	public static void main(String[] args) throws Exception {
		FetionManager.getManger().login("13544424150", "");
		FetionManager.getManger().send("13544424150", "13544424150", "123");
		FetionManager.getManger().loginOut("13544424150");
	}

}
