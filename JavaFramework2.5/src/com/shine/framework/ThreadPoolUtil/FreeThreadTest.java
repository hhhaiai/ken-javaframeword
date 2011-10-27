package com.shine.framework.ThreadPoolUtil;

public class FreeThreadTest {

	public void println(String test) {
		System.out.println("FreeThreadTest:" + test);
	}

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		// 注入测试方法
		ThreadPoolManager.getManager().putFreeModel("test1",
				"com.shine.framework.ThreadPoolUtil.FreeThreadTest", "println");
		// 注入测试方法2
		ThreadPoolManager.getManager()
				.putFreeModel("test2",
						"com.shine.framework.ThreadPoolUtil.FreeThreadTest2",
						"println");
		// 注入测试方法3
		FreeThreadTest3 freeThreadTest3 = new FreeThreadTest3();
		ThreadPoolManager.getManager().putFreeModel("test3", freeThreadTest3,
				"println");

		// 初始化初始线程和最大线程
		ThreadPoolManager.getManager().initFreeThreadPool(2, 100);
		// 启动线程池
		ThreadPoolManager.getManager().startThreadPool();

		ThreadPoolManager.getManager().getFreeThread().setValues("test1",
				"FreeThreadTest");
		ThreadPoolManager.getManager().getFreeThread().setValues("test2",
				"FreeThreadTest2");
		ThreadPoolManager.getManager().getFreeThread().setValues("test1",
				"FreeThreadTest");
		ThreadPoolManager.getManager().getFreeThread().setValues("test1",
				"FreeThreadTest");
		ThreadPoolManager.getManager().getFreeThread().setValues("test3",
				"FreeThreadTest3");

	}
}
