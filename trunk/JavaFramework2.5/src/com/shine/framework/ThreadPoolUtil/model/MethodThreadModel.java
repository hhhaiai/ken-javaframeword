package com.shine.framework.ThreadPoolUtil.model;

import com.shine.framework.core.util.ReflectionUtil;

public class MethodThreadModel extends ThreadModel {
	protected String methodName;
	protected Object object;

	public MethodThreadModel() {

	}

	public MethodThreadModel(Object object, String methodName) {
		this.object = object;
		this.methodName = methodName;
	}

	@Override
	public void excute(Object... args) {
		try {
			ReflectionUtil.invokeMethod(object, methodName);
		} catch (Exception e) {
			e.printStackTrace();
		}

	}

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

}
