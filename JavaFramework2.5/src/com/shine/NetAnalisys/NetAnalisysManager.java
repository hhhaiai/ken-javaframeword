package com.shine.NetAnalisys;

import java.util.List;

import com.shine.NetAnalisys.threadModel.NetPortThreadModel;
import com.shine.NetAnalisys.threadModel.NetScanThreadModel;
import com.shine.NetAnalisys.util.NetWorkUtil;
import com.shine.framework.ThreadPoolUtil.ThreadPoolManager;
import com.shine.framework.ThreadPoolUtil.util.SuperThread;

/**
 * 网络分析类库 主要包括ip扫描，端口分析
 * 
 * @author viruscodecn@gmail.com
 * 
 */
public class NetAnalisysManager {
	private static NetAnalisysManager manager = null;

	private int netScanSize = 10;

	private int netPortSize = 10;

	public static NetAnalisysManager getManager() {
		if (manager == null)
			manager = new NetAnalisysManager();
		return manager;
	}

	/**
	 * 初始化线程
	 */
	public void initThreadModel() {
		for (int i = 0; i < netScanSize; i++) {
			addNetScanThreadModel(i);
		}
		for (int i = 0; i < netPortSize; i++) {
			addNetPortThreadModel(i);
		}
		ThreadPoolManager.getManager().startThreadPool();
	}

	/**
	 * 加入扫描线程
	 * 
	 * @param i
	 */
	private void addNetScanThreadModel(int i) {
		NetScanThreadModel threadModel = new NetScanThreadModel();
		threadModel.setThreadName("netScanThreadModel" + i);
		ThreadPoolManager.getManager().addThread(threadModel);
		threadModel = null;
	}

	/**
	 * 加入网络端口扫描线程
	 * 
	 * @param i
	 */
	private void addNetPortThreadModel(int i) {
		NetPortThreadModel threadModel = new NetPortThreadModel();
		threadModel.setThreadName("netPortThreadModel" + i);
		ThreadPoolManager.getManager().addThread(threadModel);
		threadModel = null;
	}

	/**
	 * 启动网络ip扫描
	 * 
	 * @param startIp
	 * @param endIp
	 * @param o
	 * @param methodName
	 */
	public void startNetScan(String startIp, String endIp, Object o,
			String methodName) {
		List<String[]> ipRangeList = NetWorkUtil
				.seperateIpRange(startIp, endIp);
		int index = 0;
		while (index < ipRangeList.size()) {
			// 获取空闲线程，如果线程繁忙则等待
			SuperThread theThread = ThreadPoolManager.getManager()
					.getIdleThread("netScanThreadModel");
			if (theThread != null) {
				NetScanThreadModel netScanModel = (NetScanThreadModel) theThread
						.getThreadModel();
				netScanModel.setObject(o);
				netScanModel.setMethodName(methodName);
				theThread.setValues(ipRangeList.get(index));
				index++;
			} else {
				try {
					Thread.sleep(1000);
				} catch (InterruptedException e) {
				}
			}
		}
		// ThreadPoolManager.getManager().stopThreadPool();
	}

	/**
	 * 启动网络端口扫描
	 * 
	 * @param ip
	 * @param minPort
	 * @param maxPort
	 * @param o
	 * @param methodName
	 */
	public void startNetPort(String ip, int minPort, int maxPort, Object o,
			String methodName) {
		List<String[]> ipPortList = NetWorkUtil.seperateIpPort(ip, minPort,
				maxPort);
		int index = 0;
		while (index < ipPortList.size()) {
			// 获取空闲线程，如果线程繁忙则等待
			SuperThread theThread = ThreadPoolManager.getManager()
					.getIdleThread("netPortThreadModel");
			if (theThread != null) {
				NetPortThreadModel netPortModel = (NetPortThreadModel) theThread
						.getThreadModel();
				netPortModel.setObject(o);
				netPortModel.setMethodName(methodName);
				theThread.setValues(ipPortList.get(index));
				index++;
			} else {
				try {
					Thread.sleep(1000);
				} catch (InterruptedException e) {
				}
			}
		}
	}

	public int getNetScanSize() {
		return netScanSize;
	}

	public void setNetScanSize(int netScanSize) {
		this.netScanSize = netScanSize;
	}

	public int getNetPortSize() {
		return netPortSize;
	}

	public void setNetPortSize(int netPortSize) {
		this.netPortSize = netPortSize;
	}
}
