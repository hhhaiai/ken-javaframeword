package com.shine.framework.ThreadPoolUtil.model;

import com.shine.framework.ThreadPoolUtil.ThreadPoolManager;

public class MonitorThreadModel extends ThreadModel {

	public MonitorThreadModel() {
		this.setThreadName("MonitorThread");
		this.setType("MonitorThreadModel");
		this.setTimeOut(600000);
	}

	@Override
	public void excute(Object... args) {
		//System.out.println("=====启动回收线程======");
		ThreadPoolManager.getManager().recoverAllIdleThreadModel();
		//System.out.println("=======回收完成=======");
	}

}
