package com.shine.framework.ThreadPoolUtil.model;

public abstract class ThreadModel {
	private String threadName;
	private boolean state;
	private int timeOut;

	public String getThreadName() {
		return threadName;
	}

	public void setThreadName(String threadName) {
		this.threadName = threadName;
	}

	public boolean isState() {
		return state;
	}

	public void setState(boolean state) {
		this.state = state;
	}

	public boolean getState() {
		return state;
	}
	

	public int getTimeOut() {
		return timeOut;
	}

	public void setTimeOut(int timeOut) {
		this.timeOut = timeOut;
	}

	// 执行方法
	public abstract void excute();

}
