package com.shine.framework.ThreadPoolUtil;

import java.util.Map;

import com.shine.framework.ThreadPoolUtil.model.ThreadModel;
import com.shine.framework.ThreadPoolUtil.util.SuperThread;
import com.shine.framework.ThreadPoolUtil.util.ThreadPool;

/**
 * 线程池管理
 * 
 * @author viruscodecn@gmail.com
 * @blog
 * 
 */
public class ThreadPoolManager {
	public static ThreadPoolManager manager = new ThreadPoolManager();
	public ThreadPool pool = new ThreadPool();
	public boolean state = false;

	public ThreadPoolManager() {
	}

	public ThreadPoolManager getManager() {
		return manager;
	}

	public synchronized void initPool(String xmlPath) {
	}

	public synchronized void initPool() {
	}

	/**
	 * 启动线程池
	 */
	public synchronized void startThreadPool() {
		if (!this.state) {
			for (Map.Entry<String, SuperThread> entry : pool.entrySet()) {
				entry.getValue().start();
			}
			this.state = true;
		}
	}

	/**
	 * 重启线程池
	 */
	public synchronized void restartThreadPool() {
		this.stopThreadPool();
		this.startThreadPool();
	}

	/**
	 * 关闭线程池
	 */
	public synchronized void stopThreadPool() {
		if (this.state) {
			for (Map.Entry<String, SuperThread> entry : pool.entrySet()) {
				entry.getValue().setState(false);
			}
			this.state = false;
		}
	}

	/**
	 * 加入新的线程
	 * @param model
	 */
	public void addThread(ThreadModel model) {
		addThread(new SuperThread(model));
	}

	/**
	 * 加入新的线程
	 * @param thread
	 */
	public void addThread(SuperThread thread) {
		pool.putSuperThread(thread.getThreadModel().getThreadName(), thread);

		if (this.state) {
			if (!thread.isAlive()) {
				thread.start();
			}
		}
	}

	/**
	 * 杀死线程
	 * @param threadName
	 */
	public void killThread(String threadName) {
		if (this.state) {
			for (Map.Entry<String, SuperThread> entry : pool.entrySet()) {
				entry.getValue().setState(false);
				if (entry.getValue().getThreadModel().getThreadName().equals(
						threadName)) {
					entry.getValue().setState(false);
				}
			}
		}
	}
	
	

	/**
	 * 获取线程的状态
	 * @param threadName
	 * @return
	 */
	public boolean getThreadState(String threadName) {
		for (Map.Entry<String, SuperThread> entry : pool.entrySet()) {
			if (entry.getValue().getThreadModel().getThreadName().equals(
					threadName)) {
				return entry.getValue().getThreadModel().getState();
			}
		}
		return false;
	}

}
