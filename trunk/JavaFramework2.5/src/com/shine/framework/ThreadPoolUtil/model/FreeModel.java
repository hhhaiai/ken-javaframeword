package com.shine.framework.ThreadPoolUtil.model;

public class FreeModel {
	private String jarPath;
	private String classPath;
	private String method;

	public FreeModel() {

	}

	public FreeModel(String jarPath, String classPath, String method) {
		this.jarPath = jarPath;
		this.classPath = classPath;
		this.method = method;
	}

	public String getJarPath() {
		return jarPath;
	}

	public void setJarPath(String jarPath) {
		this.jarPath = jarPath;
	}

	public String getClassPath() {
		return classPath;
	}

	public void setClassPath(String classPath) {
		this.classPath = classPath;
	}

	public String getMethod() {
		return method;
	}

	public void setMethod(String method) {
		this.method = method;
	}

}
