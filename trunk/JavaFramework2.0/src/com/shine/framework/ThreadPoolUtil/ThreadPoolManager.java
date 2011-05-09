package com.shine.framework.ThreadPoolUtil;

import com.shine.framework.ThreadPoolUtil.model.ThreadModel;
import com.shine.framework.ThreadPoolUtil.util.SuperThread;
import com.shine.framework.ThreadPoolUtil.util.ThreadPool;

public class ThreadPoolManager {
	public static ThreadPoolManager manager = new ThreadPoolManager();
	public ThreadPool pool = new ThreadPool();
	public boolean state = false;

	public ThreadPoolManager() {
	}

	public ThreadPoolManager getManager() {
		return manager;
	}

	public void initPool(String xmlPath) {
	}

	public void initPool() {
	}

	public void startThreadPool() {
		if (!this.state) {
			for (SuperThread thread : pool.values()) {
				thread.start();
			}
			this.state = true;
		}
	}

	public void restartThreadPool() {
		this.stopThreadPool();
		this.startThreadPool();
	}

	public void stopThreadPool() {
		if (this.state) {
			for (SuperThread thread : pool.values()) {
				thread.setState(false);
			}
			this.state = false;
		}
	}

	public void addThread(ThreadModel model) {
		addThread(new SuperThread(model));
	}

	public void addThread(SuperThread thread) {
		pool.put(thread.getThreadModel().getThreadName(), thread);

		if (this.state) {
			if (!thread.isAlive()) {
				thread.start();
			}
		}
	}

	public void killThread(String threadName) {
		if (this.state) {
			for (SuperThread thread : pool.values()) {
				if (thread.getThreadModel().getThreadName().equals(threadName)) {
					thread.setState(false);
				}
			}
		}
	}

	public boolean getThreadState(String threadName) {
		for (SuperThread thread : pool.values()) {
			if (thread.getThreadModel().getThreadName().equals(threadName)) {
				return thread.getThreadModel().getState();
			}
		}
		return false;
	}

}
