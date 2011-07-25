package com.shine.Netflow;

public class Example {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		System.out.println("netflow 接收器 启动");

		NetflowManager.getManager().getRouteMap().put("127.0.0.1", "0");
		NetflowManager.getManager().startReceiver(6696, 20, 30);
	}

}
