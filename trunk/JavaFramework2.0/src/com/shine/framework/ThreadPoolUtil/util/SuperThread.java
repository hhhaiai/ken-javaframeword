package com.shine.framework.ThreadPoolUtil.util;

import com.shine.framework.ThreadPoolUtil.model.ThreadModel;

public class SuperThread extends Thread {
	private ThreadModel threadModel;

	public SuperThread() {

	}

	public SuperThread(ThreadModel threadModel) {
		this.threadModel = threadModel;
	}

	public void run() {
		if (threadModel != null) {
			while (threadModel.getState()) {
				try {
					threadModel.excute();

					Thread.sleep(threadModel.getTimeOut() * 1000);
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
			System.out.println("Thread" + threadModel.getThreadName()
					+ " is closing!");
		}
	}

	public ThreadModel getThreadModel() {
		return threadModel;
	}

	public void setThreadModel(ThreadModel threadModel) {
		this.threadModel = threadModel;
	}

	public void setState(boolean state) {
		this.threadModel.setState(state);
	}

	public void setTimeOut(int timeOut) {
		this.threadModel.setTimeOut(timeOut);
	}
}
