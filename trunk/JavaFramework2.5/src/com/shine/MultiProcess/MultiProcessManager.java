package com.shine.MultiProcess;

import com.shine.MultiProcess.utils.ProcessHelper;
import com.shine.MultiProcess.utils.ProcessMap;
import com.shine.MultiProcess.utils.ProcessUtils;

/**
 * 多进程管理器
 * 
 * @author viruscodecn@gmail.com
 * @blog http://blog.csdn.net/arjick/article/details/7011314
 * @blog http://blog.csdn.net/arjick/article/details/7011490
 * 
 */
public class MultiProcessManager {
	private static MultiProcessManager manager = new MultiProcessManager();

	// 进程容器
	private ProcessMap processMap = new ProcessMap();
	// jvm path
	private String jvmPath = "java";

	public static MultiProcessManager getManager() {
		return manager;
	}

	public void init() {

	}

	public void init(String xmlPath) {

	}

	/**
	 * 以独立进程执行命令
	 * 
	 * @param name
	 * @param common
	 */
	public void addProcess(String name, String common) {
		ProcessHelper helper = new ProcessHelper();
		helper.setName(name);
		helper.setCommon(common);
		processMap.put(name, helper);
		helper = null;
	}

	/**
	 * 已独立进程启动jar
	 * 
	 * @param name
	 * @param jarPath
	 * @param args
	 */
	public void addProcessByJar(String name, String jarPath, String... args) {
		addProcess(name, ProcessUtils.createJarCommon(this.jvmPath, jarPath,
				args));
	}

	/**
	 * 启动指定进程
	 * 
	 * @param name
	 */
	public void startProcess(String name) {
		if (processMap.get(name).isReady())
			processMap.get(name).start();
	}

	/**
	 * 关闭指定进程
	 * 
	 * @param name
	 */
	public void closeProcess(String name) {
		processMap.get(name).close();
	}

	/**
	 * 关闭所有进程
	 */
	public void close() {
		for (ProcessHelper helper : processMap.values()) {
			helper.close();
		}
	}

	public String operaProcess(String name, String commnd) {
		return null;
	}

	public String getJvmPath() {
		return jvmPath;
	}

	public void setJvmPath(String jvmPath) {
		this.jvmPath = jvmPath;
	}
}
