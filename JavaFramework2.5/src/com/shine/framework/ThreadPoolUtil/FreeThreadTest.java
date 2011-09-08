package com.shine.framework.ThreadPoolUtil;

public class FreeThreadTest {

	public void println(String test) {
		System.out.println(test);
	}

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		ThreadPoolManager.getManager().putFreeModel("test", null,
				"com.shine.framework.ThreadPoolUtil.FreeThreadTest", "println");
		ThreadPoolManager.getManager().initFreeThreadPool();
		ThreadPoolManager.getManager().startThreadPool();

		ThreadPoolManager.getManager().getFreeThread().setValues("test", "213");
		ThreadPoolManager.getManager().getFreeThread().setValues("test", "213");
		ThreadPoolManager.getManager().getFreeThread().setValues("test", "213");
		ThreadPoolManager.getManager().getFreeThread().setValues("test", "213");

	}
}
