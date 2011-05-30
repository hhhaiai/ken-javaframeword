package com.shine.Process.Utils;

public class JavaProcess {
	public JavaProcess() {
		System.out.println("id:" + getProcessId());
	}

	private String getProcessId() {
		return java.lang.management.ManagementFactory.getRuntimeMXBean()
				.getName().split("@")[0];
	}
}
