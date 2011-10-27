package com.shine.framework.ThreadPoolUtil.model;

import com.shine.framework.ThreadPoolUtil.util.FreeModelType;

public class FreeModel {
	private String jarPath;
	private String classPath;
	private String method;

	private Object o;

	private String freeModelType = "class";

	public FreeModel() {

	}

	public FreeModel(String jarPath, String classPath, String method) {
		this.freeModelType = FreeModelType.JARTYPE;
		this.jarPath = jarPath;
		this.classPath = classPath;
		this.method = method;
	}

	public FreeModel(String classPath, String method) {
		this.freeModelType = FreeModelType.CLASSTYPE;
		this.classPath = classPath;
		this.method = method;
	}

	public FreeModel(Object o, String method) {
		this.freeModelType = FreeModelType.OBJECTTYPE;
		this.o = o;
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

	public String getFreeModelType() {
		return freeModelType;
	}

	public void setFreeModelType(String freeModelType) {
		this.freeModelType = freeModelType;
	}

	public Object getO() {
		return o;
	}

	public void setO(Object o) {
		this.o = o;
	}

}
