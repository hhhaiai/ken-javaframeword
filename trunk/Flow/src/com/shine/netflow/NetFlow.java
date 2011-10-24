package com.shine.netflow;

import java.util.List;

import org.dom4j.Element;

import com.shine.DBUtil.DBUtil;
import com.shine.Netflow.NetflowManager;
import com.shine.framework.config.ConfigManager;
import com.shine.framework.core.util.XmlUitl;
import com.shine.netflow.handle.NetflowImpl;
import com.shine.netflow.job.JobUtil;

public class NetFlow {
	private static NetFlow flow = null;

	private NetFlow() {
	}

	public static NetFlow getNetFlow() {
		if (flow == null)
			flow = new NetFlow();
		return flow;
	}

	/**
	 * 初始化
	 */
	public void init() {
		System.out.println("netflow 接收器 启动");
		ConfigManager configMgr = ConfigManager.getManager();
		// 初始化数据库连接池和线程池
		int bathSqlSize = Integer.parseInt(configMgr.getAttribute("batch-sql")
				.getText());
		int bathThreadSize = Integer.parseInt(configMgr.getAttribute(
				"update-thread-size").getText());
		int selectThreadSize = Integer.parseInt(configMgr.getAttribute(
				"select-therad-size").getText());
		DBUtil.getInstance().initThreadConfig(bathSqlSize, bathThreadSize,
				selectThreadSize);
		DBUtil.getInstance().init(configMgr.getConfigPath() + "dbXml.xml");
		// 启动任务调度
		JobUtil.getInstance().init();
		// 加入路由路径
		List<Element> routers = XmlUitl.getAllElement(configMgr
				.getAttribute("routers"));
		for (Element element : routers) {
			List<Element> list = XmlUitl.getAllElement(element);
			String id = list.get(0).getText();
			String ip = list.get(1).getText();
			NetflowManager.getManager().getRouteMap().put(ip, id);
		}
		// 加入处理接口
		NetflowManager.getManager().getNetflowHandleMap().put("print",
				new NetflowImpl());
		// 启动接收
		String host = configMgr.getAttribute("host").getText();
		int port = Integer.parseInt(configMgr.getAttribute("port").getText());
		int cache = Integer.parseInt(configMgr.getAttribute("receive-cache")
				.getText());
		int threadSize = Integer.parseInt(configMgr.getAttribute(
				"process-thread-size").getText());
		NetflowManager.getManager()
				.startReceiver(host, port, cache, threadSize);
		configMgr = null;
	}

	public void close() {

	}
}
