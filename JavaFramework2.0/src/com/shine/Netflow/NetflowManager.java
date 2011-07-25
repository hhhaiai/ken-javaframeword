package com.shine.Netflow;

import java.util.HashMap;
import java.util.Map;

import com.shine.Netflow.receiver.NetflowRecevice;
import com.shine.Netflow.threadModel.ProcessThreadModel;
import com.shine.framework.ThreadPoolUtil.ThreadPoolManager;
import com.shine.framework.Udp.UdpManager;
import com.shine.framework.Udp.model.PrintRecevice;

/**
 * Netflow接收解析器
 * 
 * @author viruscodecn@gmail.com
 */
public class NetflowManager {
	private static NetflowManager manager = new NetflowManager();

	private Map<String, String> routeMap = new HashMap<String, String>();

	public static NetflowManager getManager() {
		return manager;
	}

	public void startReceiver() {

	}

	public void startReceiver(String configPath) {

	}

	/**
	 * 启动netflow接收
	 * 
	 * @param port
	 *            接收端口
	 * @param cache
	 *            数据包缓存
	 */
	public void startReceiver(int port, int cache, int threadSize) {
		//初始化线程池
		initThreadPool(threadSize);

		// 监听端口
		UdpManager.getManager().addBind(port);
		// 配置接收器
		UdpManager.getManager().addRecevice(port, new NetflowRecevice(cache));
		// 启动udp接收线程
		UdpManager.getManager().startRecevice();
	}

	/**
	 * 初始化线程池
	 * 
	 * @param threadSize
	 */
	private void initThreadPool(int threadSize) {
		for (int i = 0; i < threadSize; i++) {
			try {
				ProcessThreadModel model = new ProcessThreadModel();
				model.setThreadName("process" + i);
				model.setTimeOut(100);
				model.setType("process");
				ThreadPoolManager.getManager().addThread(model);
				model = null;
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		ThreadPoolManager.getManager().startThreadPool();
	}

	public Map<String, String> getRouteMap() {
		return routeMap;
	}

	public void setRouteMap(Map<String, String> routeMap) {
		this.routeMap = routeMap;
	}

}
