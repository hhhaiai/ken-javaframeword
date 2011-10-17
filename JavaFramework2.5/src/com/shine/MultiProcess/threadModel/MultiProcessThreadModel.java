package com.shine.MultiProcess.threadModel;

import com.shine.framework.ThreadPoolUtil.model.ThreadModel;

public class MultiProcessThreadModel extends ThreadModel {

	public MultiProcessThreadModel() {
		this.setType("multiProcessThread");
		this.setDescription("multiProcess");
	}

	@Override
	public void excute(Object... args) {
		if (args.length != 0) {

		} else {
          System.err.println("多进程参数出错，请修改.....");
		}
	}

}
