package com.shine.framework.PingUtil;

import com.shine.framework.PingUtil.util.PingUtil;

public class Example {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		System.out.println(PingUtil.isReachable("127.0.0.1", 5000));
	}
}
