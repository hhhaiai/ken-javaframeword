package com.shine.netflow;

import com.shine.Netflow.NetflowManager;
import com.shine.framework.DBUtil.DBUtil;
import com.shine.netflow.handle.NetflowImpl;
import com.shine.netflow.job.JobUtil;

public class NetFlow {
	public static final String SYS_PATH = System.getProperty("user.dir");
	
	public void init() {
		System.out.println("netflow 接收器 启动");
		// 初始化数据库连接池和线程池
		DBUtil.getInstance().init(
				SYS_PATH + "\\src\\com\\shine\\framework\\config\\dbXml.xml");
		// 启动任务调度
		JobUtil.getInstance().init();
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
