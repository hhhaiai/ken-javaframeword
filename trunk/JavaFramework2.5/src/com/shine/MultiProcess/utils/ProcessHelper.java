package com.shine.MultiProcess.utils;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;

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
	// 操作线程
	private PorcessExecRunnable porcessExecRunnable;
	// 接收线程
	private PorcessReceviceRunnable porcessReceviceRunnable;

	// 等待命令队列
	private List<String> porcessList = new ArrayList<String>();
	// 是否具有可操作性
	private boolean operaAble = true;
	// 是否回显每个执行结果
	private boolean echoAble = true;

	/**
	 * 启动进程
	 */
	public void start() {
		if (porcessExecRunnable == null) {
			porcessExecRunnable = new PorcessExecRunnable();
			porcessExecRunnable.setHelper(this);
			porcessExecRunnable.start();
		}

		if (processRunnable == null) {
			processRunnable = new PorcessRunnable();
			processRunnable.setHelper(this);
			processRunnable.setP(p);
			processRunnable.start();
		}

		if (porcessReceviceRunnable == null) {
			porcessReceviceRunnable = new PorcessReceviceRunnable();
			porcessReceviceRunnable.setHelper(this);
			porcessReceviceRunnable.start();
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
	 * 操作进程
	 * 
	 * @param Commnd
	 */
	public void operaProcess() {
		if (this.isComplete()) {
			if (this.isOperaAble()) {
				this.setOperaAble(false);
				try {
					if (this.getPorcessList().size() != 0) {
						String s = this.getPorcessList().remove(0);
						p.getOutputStream().write((s + " \n").getBytes());
						p.getOutputStream().flush();
						s = null;
					}
				} catch (Exception e) {
					e.printStackTrace();
				}
				this.setOperaAble(true);
			}
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

	public void addResult(String s) {
		this.result.append(s);
	}

	public void addOperaCommon(String commnd) {
		porcessList.add(commnd);
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

	public StringBuffer getResult() {
		return result;
	}

	public void setResult(StringBuffer result) {
		this.result = result;
	}

	public boolean isOperaAble() {
		return operaAble;
	}

	public void setOperaAble(boolean operaAble) {
		this.operaAble = operaAble;
	}

	public boolean isEchoAble() {
		return echoAble;
	}

	public void setEchoAble(boolean echoAble) {
		this.echoAble = echoAble;
	}

	public List<String> getPorcessList() {
		return porcessList;
	}

	public void setPorcessList(List<String> porcessList) {
		this.porcessList = porcessList;
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
				System.out.println("123");
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

/**
 * 多进程操作教程
 * 
 * @author viruscodecn@gmail.com
 * 
 */
class PorcessExecRunnable extends Thread {
	private ProcessHelper helper;

	public void run() {
		while (true) {
			helper.operaProcess();
		}
	}

	public ProcessHelper getHelper() {
		return helper;
	}

	public void setHelper(ProcessHelper helper) {
		this.helper = helper;
	}
}

/**
 * 进程接收线程
 * 
 * @author viruscodecn@gmail.com
 * 
 */
class PorcessReceviceRunnable extends Thread {
	private ProcessHelper helper;

	public void run() {
		BufferedReader br = null;
		InputStreamReader isr = null;

		try {
			while (true) {
				if (helper.getP() != null) {
					isr = new InputStreamReader(helper.getP().getInputStream());
					break;
				}
			}
			br = new BufferedReader(isr);
			while (true) {
				String line = br.readLine();
				if (line != null) {
					helper.addResult(line + "\r\n");
					if (helper.isEchoAble())
						System.out.println(line + "\r\n");
				} else {
					return;
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				if (br != null) {
					br.close();
					br = null;
				}
				if (isr != null) {
					isr.close();
					isr = null;
				}
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}

	public ProcessHelper getHelper() {
		return helper;
	}

	public void setHelper(ProcessHelper helper) {
		this.helper = helper;
	}
}
