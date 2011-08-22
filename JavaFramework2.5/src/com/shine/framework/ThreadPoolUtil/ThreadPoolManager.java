package com.shine.framework.ThreadPoolUtil;

import java.util.Map;

import com.shine.framework.ThreadPoolUtil.model.ThreadModel;
import com.shine.framework.ThreadPoolUtil.util.SuperThread;
import com.shine.framework.ThreadPoolUtil.util.ThreadPool;
import com.shine.framework.core.util.DateUtil;

/**
 * 线程池管理
 * 
 * @author viruscodecn@gmail.com
 * @blog
 * 
 */
public class ThreadPoolManager {
	private static ThreadPoolManager manager = new ThreadPoolManager();
	private ThreadPool pool = new ThreadPool();
	private boolean state = false;

	public ThreadPoolManager() {
	}

	public static ThreadPoolManager getManager() {
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
		} else {
			for (Map.Entry<String, SuperThread> entry : pool.entrySet()) {
				if (!entry.getValue().isAlive()) {
					entry.getValue().start();
				}
			}
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
	 * 根据线程类型关闭部分线程池
	 * 
	 * @param type
	 */
	public synchronized void stopThreadPool(String type) {
		if (this.state) {
			for (Map.Entry<String, SuperThread> entry : pool.entrySet()) {
				if (entry.getValue().getType().equals(type))
					entry.getValue().setState(false);
			}
		}
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
	 * 
	 * @param model
	 */
	public void addThread(ThreadModel model) {
		model = checkThreadModel(model);

		addThread(new SuperThread(model));
	}

	/**
	 * 加入新的线程
	 * 
	 * @param thread
	 */
	public void addThread(SuperThread thread) {
		thread = checkSuperThread(thread);

		pool.putSuperThread(thread.getThreadModel().getThreadName(), thread);

		if (this.state) {
			if (!thread.isAlive()) {
				thread.start();
			}
		}
	}

	/**
	 * 杀死线程
	 * 
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
	 * 
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

	/**
	 * 线程减速
	 */
	public void slow() {
		for (Map.Entry<String, SuperThread> entry : pool.entrySet()) {
			entry.getValue().getThreadModel().slow();
		}
	}

	/**
	 * 线程加速
	 */
	public void fast() {
		for (Map.Entry<String, SuperThread> entry : pool.entrySet()) {
			entry.getValue().getThreadModel().fast();
		}
	}

	/**
	 * 检查superthread
	 * 
	 * @param thread
	 * @return
	 */
	private SuperThread checkSuperThread(SuperThread thread) {
		thread.setThreadModel(checkThreadModel(thread.getThreadModel()));
		return thread;
	}

	/**
	 * 获取空闲线程
	 * 
	 * @return
	 */
	public SuperThread getIdleThread() {
		for (Map.Entry<String, SuperThread> entry : pool.entrySet()) {
			if (!entry.getValue().isBusy()) {
				return entry.getValue();
			}
		}
		return null;
	}

	/**
	 * 根据类型获取空闲线程
	 * 
	 * @param type
	 * @return
	 */
	public SuperThread getIdleThread(String type) {
		for (Map.Entry<String, SuperThread> entry : pool.entrySet()) {
			if (entry.getValue().getType().equals(type)
					&& !entry.getValue().isBusy()) {
				return entry.getValue();
			}
		}
		return null;
	}

	/**
	 * 删除线程池中的线程
	 * 
	 * @param threadName
	 */
	public void deleteThread(String threadName) {
		pool.remove(threadName);
	}

	/**
	 * 删除线程池中指定类型线程数据
	 * 
	 * @param type
	 */
	public void deleteThreadType(String type) {
		for (Map.Entry<String, SuperThread> entry : pool.entrySet()) {
			if (entry.getValue().getType().equals(type)) {
				pool.remove(entry.getValue().getName());
			}
		}
	}

	/**
	 * 检查threadmodel
	 * 
	 * @param threadModel
	 * @return
	 */
	private ThreadModel checkThreadModel(ThreadModel threadModel) {
		if (threadModel.getThreadName() == null) {
			threadModel.setThreadName(rendomThreadInfo());
			threadModel.setDescription(threadModel.getThreadName());
		}
		return threadModel;
	}

	/**
	 * 随机线程名称
	 * 
	 * @return
	 */
	private String rendomThreadInfo() {
		return "thread" + DateUtil.getCurrentDateTimeDetailAsId();
	}

	public ThreadPool getPool() {
		return pool;
	}

	public void setPool(ThreadPool pool) {
		this.pool = pool;
	}

}
