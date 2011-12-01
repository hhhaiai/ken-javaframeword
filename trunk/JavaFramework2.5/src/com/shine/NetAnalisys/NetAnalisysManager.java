package com.shine.NetAnalisys;

import java.util.List;

import com.shine.NetAnalisys.threadModel.NetScanThreadModel;
import com.shine.framework.ThreadPoolUtil.ThreadPoolManager;

/**
 * 网络分析类库 主要包括ip扫描，端口分析
 * 
 * @author viruscodecn@gmail.com
 * 
 */
public class NetAnalisysManager {
	private static NetAnalisysManager manager = null;

	private int netScanSize = 5;

	public static NetAnalisysManager getManager() {
		if (manager == null)
			manager = new NetAnalisysManager();
		return manager;
	}

	public void initThreadModel() {

	}

	private void addThreadModel(int i) {
		NetScanThreadModel threadModel = new NetScanThreadModel();
		threadModel.setThreadName("netScanThreadModel" + i);
		ThreadPoolManager.getManager().addThread(threadModel);
		threadModel = null;
	}

	public void startNetScan(String startIp, String endIp, Object o,
			String methodName) {

	}

	public int getNetScanSize() {
		return netScanSize;
	}

	public void setNetScanSize(int netScanSize) {
		this.netScanSize = netScanSize;
	}

}
