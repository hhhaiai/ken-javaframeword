package com.shine.Netflow;

import com.shine.Netflow.netflowIf.NetFlowImpl;

public class Example {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		System.out.println("netflow 接收器 启动");

		// 加入路由路径
		NetflowManager.getManager().getRouteMap().put("198.168.1.1", "0");
		NetflowManager.getManager().getRouteMap().put("1.1.1.1", "1");
		// 加入处理接口
		NetflowManager.getManager().getNetflowHandleMap().put("print",
				new NetFlowImpl());
		// 启动接收
		NetflowManager.getManager().startReceiver("192.168.12.2", 6696, 1, 2);
	}

}
