package com.shine.MultiProcess;

import com.shine.MultiProcess.utils.ProcessMap;
import com.shine.MultiProcess.utils.ProcessUtils;

/**
 * 多进程管理器
 * 
 * @author viruscodecn@gmail.com
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

	public void addProcess(String name, String... common) {

	}

	public void addProcessByJar(String name, String jarPath, String... args) {
		System.out.println(ProcessUtils.createJarCommon(this.jvmPath, jarPath,
				args));
	}

	public void closeProcess(String name) {

	}

	public void close() {

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
