package com.shine.netflow;

import com.shine.Netflow.NetflowManager;
import com.shine.framework.DBUtil.DBUtil;
import com.shine.netflow.handle.NetflowImpl;

public class NetFlow {
	public void init() {
		System.out.println("netflow 接收器 启动");

		DBUtil
				.getInstance()
				.init(
						"E:\\workspace\\Flow\\src\\com\\shine\\framework\\config\\dbXml.xml");

		// 加入路由路径
		NetflowManager.getManager().getRouteMap().put("127.0.0.1", "0");
		// 加入处理接口
		NetflowManager.getManager().getNetflowHandleMap().put("print",
				new NetflowImpl());
		// 启动接收
		NetflowManager.getManager().startReceiver(6696, 10, 2);
	}

	public void close() {

	}
}
