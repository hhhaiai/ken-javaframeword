package com.shine.NetAnalisys;

import java.util.List;

import com.shine.NetAnalisys.model.NetAnalyzeCallBack;
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

	public void initThreadModel() {
		initNetScanThreadModel();
		initNetPortThreadModel();
	}

	public void initNetScanThreadModel() {
		for (int i = 0; i < netScanSize; i++) {
			addNetScanThreadModel(i);
		}
		ThreadPoolManager.getManager().startThreadPool();
	}

	public void initNetPortThreadModel() {
		for (int i = 0; i < netPortSize; i++) {
			addNetPortThreadModel(i);
		}
		ThreadPoolManager.getManager().startThreadPool();
	}

	private void addNetScanThreadModel(int i) {
		NetScanThreadModel threadModel = new NetScanThreadModel();
		threadModel.setThreadName("netScanThreadModel" + i);
		ThreadPoolManager.getManager().addThread(threadModel);
		threadModel = null;
	}

	private void addNetPortThreadModel(int i) {
		NetPortThreadModel threadModel = new NetPortThreadModel();
		threadModel.setThreadName("netPortThreadModel" + i);
		ThreadPoolManager.getManager().addThread(threadModel);
		threadModel = null;
	}

	/**
	 * 开始执行网络扫描
	 * 
	 * @param startIp
	 * @param endIp
	 * @param callback
	 * @param methodName
	 */
	public void startNetScan(String startIp, String endIp,
			NetAnalyzeCallBack callback, String methodName) {
		List<String[]> ipRangeList = NetWorkUtil.seperateIpRange(startIp,
				endIp, 2);
		int index = 0;
		callback.setAnalyzeFinished(false);
		long firstTime = System.currentTimeMillis();
		while (index < ipRangeList.size()) {
			// 获取空闲线程，如果线程繁忙则等待
			SuperThread theThread = ThreadPoolManager.getManager()
					.getIdleThread("netScanThreadModel");
			if (theThread != null) {
				NetScanThreadModel netScanModel = (NetScanThreadModel) theThread
						.getThreadModel();
				if (netScanModel.getObject() == null) {
					netScanModel.setObject(callback);
				}
				netScanModel.setMethodName(methodName);
				theThread.setValues(ipRangeList.get(index));
				index++;
			} else {
				try {
					Thread.sleep(500);
				} catch (InterruptedException e) {
				}
			}
		}
		while (ThreadPoolManager.getManager().getIdleThreadSize(
				"netScanThreadModel") != this.netScanSize) {
			try {
				Thread.sleep(500);
			} catch (InterruptedException e) {
			}
		}
		callback.setAnalyzeFinished(true);
		long passTime = System.currentTimeMillis() - firstTime;
		// System.out.println("执行所需时间:" + passTime);
		// ThreadPoolManager.getManager().stopThreadPool();
	}

	/**
	 * 开始执行端口扫描
	 * 
	 * @param ip
	 * @param minPort
	 * @param maxPort
	 * @param callback
	 * @param methodName
	 */
	public void startNetPort(String ip, int minPort, int maxPort,
			NetAnalyzeCallBack callback, String methodName) {
		List<String[]> ipPortList = NetWorkUtil.seperateIpPort(ip, minPort,
				maxPort);
		int index = 0;
		callback.setAnalyzeFinished(false);
		while (index < ipPortList.size()) {
			// 获取空闲线程，如果线程繁忙则等待
			SuperThread theThread = ThreadPoolManager.getManager()
					.getIdleThread("netPortThreadModel");
			if (theThread != null) {
				NetPortThreadModel netPortModel = (NetPortThreadModel) theThread
						.getThreadModel();
				netPortModel.setObject(callback);
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
		callback.setAnalyzeFinished(true);
	}

	public void stopNetScanThread() {
		ThreadPoolManager.getManager().stopThreadPool("netScanThreadModel");
	}

	public void stopNetPortThread() {
		ThreadPoolManager.getManager().stopThreadPool("netPortThreadModel");
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
