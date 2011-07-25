package com.shine.framework.ThreadPoolUtil.model;

public abstract class ThreadModel {
	private String threadName;
	private String type;
	private boolean state = true;
	private int timeOut = 100;
	private String description;

	public String getThreadName() {
		return threadName;
	}

	public void setThreadName(String threadName) {
		this.threadName = threadName;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
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

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public void slow() {
		this.timeOut = this.timeOut * 150 / 100;
	}

	public void fast() {
		this.timeOut = this.timeOut / 2;
	}

	// 执行方法
	public abstract void excute(Object... args);

}
