package com.shine.framework.ThreadPoolUtil.model;

public abstract class ThreadModel {
	private String threadName;
	private boolean state;

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

}
