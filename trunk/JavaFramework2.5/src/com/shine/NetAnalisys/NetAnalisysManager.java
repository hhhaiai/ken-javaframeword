package com.shine.NetAnalisys;

import java.util.List;

/**
 * 网络分析类库 主要包括ip扫描，端口分析
 * 
 * @author viruscodecn@gmail.com
 * 
 */
public class NetAnalisysManager {
	private static NetAnalisysManager manager = null;

	public static NetAnalisysManager getManager() {
		if (manager == null)
			manager = new NetAnalisysManager();
		return manager;
	}

	public void initThreadModel() {

	}

	private void addThreadModel() {

	}

	public void startNetScan(String startIp, String endIp, Object o,
			String methodName) {

	}

}
