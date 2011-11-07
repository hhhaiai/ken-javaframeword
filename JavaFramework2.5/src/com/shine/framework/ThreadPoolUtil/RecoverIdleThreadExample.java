package com.shine.framework.ThreadPoolUtil;

public class RecoverIdleThreadExample {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		// 初始化初始线程和最大线程
		ThreadPoolManager.getManager().initFreeThreadPool(20, 100);
		// 启动线程池
		ThreadPoolManager.getManager().startThreadPool();
	}

}
