package com.shine.framework.ThreadPoolUtil.model;

import com.shine.framework.core.util.ReflectionUtil;

public class XmlThreadModel extends ThreadModel {
	private String classPath;
	private String method;

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

	@Override
	public void excute(Object... args) {
		try {
			if (classPath != null && classPath.length() != 0 && method != null
					&& method.length() != 0) {
				ReflectionUtil.invokeMethod(classPath, method);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

}
