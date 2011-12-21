package com.shine.framework.ThreadPoolUtil.util;

public class MonitorControl {
	private String type;
	// init thread pool size
	private int initThreadPool = 2;
	// max thread pool size
	private int maxThreadPool = 100;
	// 空闲线程
	private int idleThreadPool = 100;

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public int getInitThreadPool() {
		return initThreadPool;
	}

	public void setInitThreadPool(int initThreadPool) {
		this.initThreadPool = initThreadPool;
	}

	public int getMaxThreadPool() {
		return maxThreadPool;
	}

	public void setMaxThreadPool(int maxThreadPool) {
		this.maxThreadPool = maxThreadPool;
	}

	public int getIdleThreadPool() {
		return idleThreadPool;
	}

	public void setIdleThreadPool(int idleThreadPool) {
		this.idleThreadPool = idleThreadPool;
	}
}
