package com.shine.framework.RemoteAnalysis;

import java.util.List;

import com.shine.framework.RemoteAnalysis.util.RemotePortScanHelper;

public class Example {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		List<Integer> list = RemoteAnalysisManager.getManager().scanPort(
				"192.168.2.18", 0, 200);

		for (int num : list) {
			System.out.println(num);
		}
	}

}
