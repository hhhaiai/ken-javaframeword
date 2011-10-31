package com.shine.framework.ThreadPoolUtil;

import java.util.Map;

import com.shine.framework.ThreadPoolUtil.model.FreeModel;
import com.shine.framework.ThreadPoolUtil.model.FreeThreadModel;
import com.shine.framework.ThreadPoolUtil.model.ThreadModel;
import com.shine.framework.ThreadPoolUtil.util.FreeModelMap;
import com.shine.framework.ThreadPoolUtil.util.SuperThread;
import com.shine.framework.ThreadPoolUtil.util.ThreadPool;
import com.shine.framework.core.util.DateUtil;

/**
 * 线程池管理
 * 
 * @author viruscodecn@gmail.com
 * @blog 概述 http://blog.csdn.net/arjick/article/details/6759191
 * @blog 线程池使用 http://blog.csdn.net/arjick/article/details/6911189
 * 
 */
public class ThreadPoolManager {
	private static ThreadPoolManager manager = null;
	private ThreadPool pool = new ThreadPool();
	private boolean state = false;

	private FreeModelMap map = new FreeModelMap();

	// init thread pool size
	private int initThreadPool = 2;
	// max thread pool size
	private int maxThreadPool = 100;
	// 空闲线程
	private int idleThreadPool = 10;

	public ThreadPoolManager() {
	}

	public static ThreadPoolManager getManager() {
		if (manager == null)
			manager = new ThreadPoolManager();
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

	public void initFreeThreadPool(int initThreadPool, int maxThreadPool) {
		this.initThreadPool = initThreadPool;
		this.maxThreadPool = maxThreadPool;
		initFreeThreadPool();
	}

	/**
	 * 初始化自由线程
	 */
	public void initFreeThreadPool() {
		for (int i = 0; i < initThreadPool; i++) {
			addFreeThread(i);
		}
	}

	/**
	 * 扩展自由线程
	 */
	public synchronized SuperThread incomeFreeThreadPool() {
		if (initThreadPool < maxThreadPool) {
			initThreadPool++;
			addFreeThread(initThreadPool);
			System.err.println("扩展自由线程线程数" + initThreadPool);
			return this.getIdleThread("freeThreadModel");
		} else {
			System.err.println("自由线程已经达到最大值" + maxThreadPool);
			return null;
		}
	}

	/**
	 * 加入批量提交线程
	 * 
	 * @param i
	 */
	private void addFreeThread(int i) {
		FreeThreadModel model = new FreeThreadModel();
		model.setThreadName("freeThread" + i);
		this.addThread(model);
		model = null;
	}

	public synchronized SuperThread getFreeThread() {
		if (this.getIdleThread("freeThreadModel") != null) {
			return this.getIdleThread("freeThreadModel");
		} else {
			return incomeFreeThreadPool();
		}
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

//	public int getIdleThreadSize(String type) {
//
//	}

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

	/**
	 * 加入线程处理器
	 * 
	 * @param modleName
	 * @param jarPath
	 * @param classPath
	 * @param method
	 */
	public void putFreeModel(String modleName, String jarPath,
			String classPath, String method) {
		FreeModel model = new FreeModel(jarPath, classPath, method);
		map.put(modleName, model);
		model = null;
	}

	/**
	 * 加入线程处理器
	 * 
	 * @param modleName
	 * @param o
	 * @param method
	 */
	public void putFreeModel(String modleName, Object o, String method) {
		FreeModel model = new FreeModel(o, method);
		map.put(modleName, model);
		model = null;
	}

	/**
	 * 加入线程处理器
	 * 
	 * @param modleName
	 * @param classPath
	 * @param method
	 */
	public void putFreeModel(String modleName, String classPath, String method) {
		FreeModel model = new FreeModel(classPath, method);
		map.put(modleName, model);
		model = null;
	}

	/**
	 * 删除线程处理器
	 * 
	 * @param modleName
	 */
	public void deleteFreeModel(String modleName) {
		map.remove(modleName);
	}

	public ThreadPool getPool() {
		return pool;
	}

	public void setPool(ThreadPool pool) {
		this.pool = pool;
	}

	public FreeModelMap getMap() {
		return map;
	}

	public void setMap(FreeModelMap map) {
		this.map = map;
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

}
