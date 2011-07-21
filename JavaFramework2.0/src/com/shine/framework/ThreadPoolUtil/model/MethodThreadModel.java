package com.shine.framework.ThreadPoolUtil.model;

import com.shine.framework.core.util.ReflectionUtil;

public class MethodThreadModel extends ThreadModel {
	private String methodName;
	private Object object;

	public String getMethodName() {
		return methodName;
	}

	public void setMethodName(String method) {
		this.methodName = method;
	}

	public Object getObject() {
		return object;
	}

	public void setObject(Object object) {
		this.object = object;
	}

	@Override
	public void excute(Object... args) {
		try {
			ReflectionUtil.invokeMethod(object, methodName);
		} catch (Exception e) {
			e.printStackTrace();
		}

	}

}
