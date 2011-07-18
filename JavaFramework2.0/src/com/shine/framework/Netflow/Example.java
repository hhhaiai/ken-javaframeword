package com.shine.Netflow;

public class Example {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		System.out.println("netflow 接收器 启动");
		
		NetflowManager.getManager().startReceiver(6696, 20);
	}

}
