package com.shine.framework.ThreadPoolUtil.util;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 线程池容器
 * 
 * @author viruscodecn@gmail.com
 * 
 */
@SuppressWarnings("serial")
public class ThreadPool extends HashMap<String, SuperThread> {
	private int maxThread = 1000;
	private int idleThread = 10;

	public ThreadPool() {
		super();
	}

	/**
	 * 放入线程
	 * 
	 * @param name
	 * @param thread
	 */
	public synchronized void putSuperThread(String name, SuperThread thread) {
		if (name != null && thread != null) {
			if (maxThread > this.size())
				this.put(name, thread);
			else
				System.out.println("线程池容量达到最大值:" + maxThread + ","
						+ thread.getThreadModel().getThreadName() + "无法加入线程池");
		} else {
			System.out.println("系统出错，无法加入新的线程 ");
		}
	}

	/**
	 * 获取所有的类型
	 * 
	 * @return
	 */
	public List<String> getAllTypes() {
		List<String> list = new ArrayList<String>();
		for (Map.Entry<String, SuperThread> entry : this.entrySet()) {
			if (!list.contains(entry.getValue().getType())) {
				list.add(entry.getValue().getType());
			}
		}
		return list;
	}

	public int getMaxThread() {
		return maxThread;
	}

	public void setMaxThread(int maxThread) {
		this.maxThread = maxThread;
	}
}
