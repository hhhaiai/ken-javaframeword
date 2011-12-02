package com.shine.MultiProcess.threadModel;

import com.shine.framework.ThreadPoolUtil.model.ThreadModel;

public class ProcessClientThreadModel extends ThreadModel {

	public ProcessClientThreadModel() {
		this.setType("processClientThreadModel");
		this.setTimeOut(1000);
	}

	@Override
	public void excute(Object... args) {
		// TODO Auto-generated method stub

	}

}
