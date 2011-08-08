package com.shine.Netflow;

import java.util.HashMap;
import java.util.Map;

import com.shine.Netflow.netflowIf.NetFlowIf;
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
	private Map<String, NetFlowIf> netflowHandleMap = new HashMap<String, NetFlowIf>();

	private int threadSize = 20;
	private int maxThreadSize = 200;

	private int cache = 20;
	private int maxCache = 1000;
	private int incomeCache = 10;

	private int port;

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
	public void startReceiver(String host, int port, int cache, int threadSize) {
		this.cache = cache;
		this.threadSize = threadSize;
		this.port = port;

		// 初始化线程池
		initThreadPool(threadSize);

		// 监听端口
		UdpManager.getManager().addBind(host, port);
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
			addThread(i);
		}
		ThreadPoolManager.getManager().startThreadPool();
	}

	/**
	 * 加入新的线程
	 * 
	 * @param i
	 */
	public void addThread(int i) {
		try {
			ProcessThreadModel model = new ProcessThreadModel();
			model.setThreadName("process" + i);
			model.setTimeOut(100);
			ThreadPoolManager.getManager().addThread(model);
			model = null;
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * 自动升级系统
	 */
	public void autoUpdate() {
		autoAddThread();
		autoAddCache();
	}

	/**
	 * 动态加入新的线程
	 */
	public void autoAddThread() {
		if (threadSize < maxThreadSize) {
			threadSize = threadSize + 1;
			addThread(threadSize);
			ThreadPoolManager.getManager().startThreadPool();
			System.err.println("加入新的解析线程完成,现在处理线程数为:" + threadSize);
		} else {
			System.err.println("无法加入新的处理线程，已经达到最大值" + maxThreadSize);
		}
	}

	/**
	 * 升级缓存
	 */
	public void autoAddCache() {
		if (cache < maxCache) {
			cache = cache + incomeCache;
			UdpManager.getManager().addRecevice(port,
					new NetflowRecevice(cache));
			System.err.println("升级缓存完成，现在缓存数位:" + cache);
		} else {
			System.err.println("无法升级缓存，已经达到最大值" + maxCache);
		}
	}

	public Map<String, String> getRouteMap() {
		return routeMap;
	}

	public void setRouteMap(Map<String, String> routeMap) {
		this.routeMap = routeMap;
	}

	public Map<String, NetFlowIf> getNetflowHandleMap() {
		return netflowHandleMap;
	}

	public void setNetflowHandleMap(Map<String, NetFlowIf> netflowHandleMap) {
		this.netflowHandleMap = netflowHandleMap;
	}

	public int getThreadSize() {
		return threadSize;
	}

	public void setThreadSize(int threadSize) {
		this.threadSize = threadSize;
	}

	public int getMaxThreadSize() {
		return maxThreadSize;
	}

	public void setMaxThreadSize(int maxThreadSize) {
		this.maxThreadSize = maxThreadSize;
	}
}
