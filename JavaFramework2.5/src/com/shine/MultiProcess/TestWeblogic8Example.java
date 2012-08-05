package com.shine.MultiProcess;

public class TestWeblogic8Example {
	public static void main(String args[]) {
		MultiProcessManager.getManager().setJvmPath(
				"C:\\Program Files\\Java\\jre6\\bin\\java");
		MultiProcessManager.getManager().addProcessByJar("test",
				"F:\\下载\\javaFramework2_5_5.jar");
		MultiProcessManager.getManager().startProcess("test");

		MultiProcessManager.getManager().operaProcess("test", "test1");
		MultiProcessManager.getManager().operaProcess("test", "test2");
	}
}
