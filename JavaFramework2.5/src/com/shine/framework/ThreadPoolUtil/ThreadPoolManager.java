package com.shine.framework.ThreadPoolUtil;

import java.util.List;
import java.util.Map;

import com.shine.framework.ThreadPoolUtil.model.FreeModel;
import com.shine.framework.ThreadPoolUtil.model.FreeThreadModel;
import com.shine.framework.ThreadPoolUtil.model.MonitorThreadModel;
import com.shine.framework.ThreadPoolUtil.model.ThreadModel;
import com.shine.framework.ThreadPoolUtil.util.FreeModelMap;
import com.shine.framework.ThreadPoolUtil.util.MonitorControl;
import com.shine.framework.ThreadPoolUtil.util.MonitorControlPool;
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

	private MonitorControlPool monitorControlPool = new MonitorControlPool();

	// // init thread pool size
	// private int initThreadPool = 2;
	// // max thread pool size
	// private int maxThreadPool = 100;
	// // 空闲线程
	// private int idleThreadPool = 10;

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
		this.startThreadPool(true);
	}
	
	/**
	 * 启动线程池
	 * 
	 * @param isMonitor 是否开启监控线程
	 */
	public synchronized void startThreadPool(boolean isMonitor) {
		if (isMonitor) {
			this.addThread(new MonitorThreadModel());
		}
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
	 * 初始化自由线程
	 * 
	 * @param initThreadPool
	 * @param maxThreadPool
	 */
	public void initFreeThreadPool(int initThreadPool, int maxThreadPool) {
		MonitorControl control = new MonitorControl();
		control.setInitThreadPool(initThreadPool);
		control.setMaxThreadPool(maxThreadPool);
		control.setIdleThreadPool(10);
		monitorControlPool.put("freeThreadModel", control);
		initFreeThreadPool();
	}

	/**
	 * 初始化自由线程
	 */
	public void initFreeThreadPool() {
		for (int i = 0; i < monitorControlPool
				.getInitThreadPool("freeThreadModel"); i++) {
			addFreeThread(i);
		}
	}

	/**
	 * 扩展自由线程
	 */
	public synchronized SuperThread incomeFreeThreadPool() {
		int size = getThreadSize("freeThreadModel");
		if (size < monitorControlPool.getMaxThreadPool("freeThreadModel")) {
			size++;
			addFreeThread(size);
			System.err.println("扩展自由线程线程数" + size);
			return this.getIdleThread("freeThreadModel");
		} else {
			System.err.println("自由线程已经达到最大值"
					+ monitorControlPool.getMaxThreadPool("freeThreadModel"));
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

	/**
	 * 获取空闲线程
	 * 
	 * @return
	 */
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
	public synchronized void addThread(ThreadModel model) {
		model = checkThreadModel(model);

		addThread(new SuperThread(model));
	}

	/**
	 * 加入新的线程
	 * 
	 * @param thread
	 */
	public synchronized void addThread(SuperThread thread) {
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
	public synchronized void killThread(String threadName) {
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
	 * 获取该线程的数量
	 * 
	 * @param type
	 * @return
	 */
	public int getThreadSize(String type) {
		int num = 0;
		for (Map.Entry<String, SuperThread> entry : pool.entrySet()) {
			if (entry.getValue().getType().equals(type)) {
				num++;
			}
		}
		return num;
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
	public synchronized SuperThread getIdleThread() {
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
	public synchronized SuperThread getIdleThread(String type) {
		for (Map.Entry<String, SuperThread> entry : pool.entrySet()) {
			if (entry.getValue().getType().equals(type)
					&& !entry.getValue().isBusy()) {
				return entry.getValue();
			}
		}
		return null;
	}

	/**
	 * 获取空闲线程数
	 * 
	 * @param type
	 * @return
	 */
	public synchronized int getIdleThreadSize(String type) {
		int num = 0;
		for (Map.Entry<String, SuperThread> entry : pool.entrySet()) {
			if (entry.getValue().getType().equals(type)
					&& !entry.getValue().isBusy()) {
				num++;
			}
		}
		return num;
	}

	/**
	 * 删除线程池中的线程
	 * 
	 * @param threadName
	 */
	public synchronized void deleteThread(String threadName) {
		pool.remove(threadName);
	}

	/**
	 * 删除池中的线程
	 * 
	 * @param superThread
	 */
	public synchronized void deleteThread(SuperThread superThread) {
		pool.remove(superThread.getThreadModel().getThreadName());
	}

	/**
	 * 删除线程池中指定类型线程数据
	 * 
	 * @param type
	 */
	public synchronized void deleteThreadType(String type) {
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

	/**
	 * 回收空闲线程
	 * 
	 * @param type
	 * @param idleThreadSize
	 */
	public synchronized void recoverIdleThreadModel(String type,
			int idleThreadSize) {
		if (idleThreadSize < this.getIdleThreadSize(type)) {
			int recoverSize = this.getIdleThreadSize(type) - idleThreadSize;
			System.out.println("回收线程类型：" + type + " 回收线程数：" + recoverSize);
			for (int i = 0; i < recoverSize; i++) {
				this.deleteThread(this.getIdleThread(type));
			}
		}
	}

	/**
	 * 回收空闲线程
	 * 
	 * @param type
	 */
	public synchronized void recoverIdleThreadModel(String type) {
		recoverIdleThreadModel(type, monitorControlPool.getIdleThreadPool(type));
	}

	/**
	 * 回收空闲线程
	 * 
	 * @param idleThreadSize
	 */
	public synchronized void recoverFreeIdleThreadModel(int idleThreadSize) {
		recoverIdleThreadModel("freeThreadModel", idleThreadSize);
	}

	/**
	 * 回收空闲线程
	 */
	public synchronized void recoverFreeIdleThreadModel() {
		recoverIdleThreadModel("freeThreadModel", monitorControlPool
				.getIdleThreadPool("freeThreadModel"));
	}

	/**
	 * 回收所有类型的空闲线程
	 */
	public synchronized void recoverAllIdleThreadModel() {
		List<String> list = pool.getAllTypes();
		if (list != null) {
			for (String type : list) {
				recoverIdleThreadModel(type);
			}
		}
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

}
