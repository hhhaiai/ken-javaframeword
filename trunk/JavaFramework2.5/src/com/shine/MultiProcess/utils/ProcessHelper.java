package com.shine.MultiProcess.utils;

public class ProcessHelper {
	private String name;
	private String common;
	private Process p;

	// 命令行结果
	private StringBuffer result = new StringBuffer();

	// 接收数据线程
	private PorcessRunnable processRunnable;
	// 关闭数据线程
	private PorcessCloseRunnable porcessCloseRunnable;

	/**
	 * 启动进程
	 */
	public void start() {
		if (processRunnable == null) {
			processRunnable = new PorcessRunnable();
			processRunnable.setHelper(this);
			processRunnable.setP(p);
			processRunnable.start();
		}
	}

	/**
	 * 关闭进程
	 */
	public void close() {
		if (porcessCloseRunnable == null) {
			porcessCloseRunnable = new PorcessCloseRunnable();
			porcessCloseRunnable.setHelper(this);
			porcessCloseRunnable.start();
		}
	}

	/**
	 * 是否已经准备好启动
	 * 
	 * @return
	 */
	public boolean isReady() {
		if (p != null)
			return false;
		else
			return true;
	}

	/**
	 * 是否启动完成
	 * 
	 * @return
	 */
	public boolean isComplete() {
		if (p != null)
			return true;
		else
			return false;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getCommon() {
		return common;
	}

	public void setCommon(String common) {
		this.common = common;
	}

	public Process getP() {
		return p;
	}

	public void setP(Process p) {
		this.p = p;
	}
}

/**
 * 进程管理线程
 * 
 * @author viruscodecn@gmail.com
 * 
 */
class PorcessRunnable extends Thread {
	private ProcessHelper helper;
	private Process p;

	public void run() {
		try {
			p = Runtime.getRuntime().exec(helper.getCommon());
			helper.setP(p);
			try {
				p.waitFor();
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
		} catch (Throwable t) {
			t.getStackTrace();
		}
	}

	public ProcessHelper getHelper() {
		return helper;
	}

	public void setHelper(ProcessHelper helper) {
		this.helper = helper;
	}

	public Process getP() {
		return p;
	}

	public void setP(Process p) {
		this.p = p;
	}
}

/**
 * 进程关闭线程
 * 
 * @author viruscodecn@gmail.com
 * 
 */
class PorcessCloseRunnable extends Thread {
	private ProcessHelper helper;

	public void run() {
		int i = 0;
		while (true) {
			if (helper.isComplete()) {
				if (helper.getP() != null)
					helper.getP().destroy();
				helper.setP(null);
				break;
			}
			i++;
		}
	}

	public ProcessHelper getHelper() {
		return helper;
	}

	public void setHelper(ProcessHelper helper) {
		this.helper = helper;
	}
}
