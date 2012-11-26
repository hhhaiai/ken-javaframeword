package com.shine.framework.ThreadPoolUtil.util;

import com.shine.framework.ThreadPoolUtil.ThreadPoolManager;
import com.shine.framework.ThreadPoolUtil.model.ThreadModel;

/**
 * 线程池原始线程
 * 
 * @author viruscodecn@gmail.com
 * 
 */
public class SuperThread extends Thread {
	private ThreadModel threadModel;
	private boolean busy = false;
	private Object[] values;

	public SuperThread() {

	}

	public SuperThread(ThreadModel threadModel) {
		this.threadModel = threadModel;
	}

	public void run() {
		if (threadModel != null) {
//			System.out.println("Thread" + threadModel.getThreadName()
//					+ " is running!");
			while (threadModel.getState()) {
				try {
					busy = true;
					if (values != null)
						threadModel.excute(values);
					else
						threadModel.excute();

					values = null;
					busy = false;

					if (threadModel.getTimeOut() != 0)
						Thread.sleep(threadModel.getTimeOut());
				} catch (Exception e) {
					e.printStackTrace();
				}
			}

			// 删除线程池中的线程
			ThreadPoolManager.getManager().deleteThread(this.getName());
//			System.out.println("Thread" + threadModel.getThreadName()
//					+ " is closing!");
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

	public boolean isBusy() {
		return busy;
	}

	public void setBusy(boolean busy) {
		this.busy = busy;
	}

	public Object[] getValues() {
		return values;
	}

	public void setValues(Object... values) {
		this.values = values;
		busy = true;
	}

	public String getType() {
		return this.threadModel.getType();
	}

}
