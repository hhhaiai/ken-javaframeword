package com.shine.framework.ThreadPoolUtil.model;

public class PrintThreadModel extends ThreadModel {

	@Override
	public void excute(Object... args) {
		System.out.println("print");
	}

}
