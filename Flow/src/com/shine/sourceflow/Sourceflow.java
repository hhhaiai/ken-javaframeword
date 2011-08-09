package com.shine.sourceflow;

import com.shine.netflow.NetFlow;

public class Sourceflow {

	private NetFlow flow = null;

	private static Sourceflow sourceflow = null;

	public static Sourceflow getSourceflow() {
		if (sourceflow == null)
			sourceflow = new Sourceflow();
		return sourceflow;
	}

	public void init() {
		// 启动netflow接收器
		NetFlow.getNetFlow().init();
	}

	public void destroy() {
		NetFlow.getNetFlow().close();
	}
}
