package com.shine.MultiProcess;

public class ResultExample {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		MultiProcessManager.getManager().setJvmPath(
				"C:\\Program Files\\Java\\jre6\\bin\\java");
//		MultiProcessManager.getManager().addProcess("test",
//				"ping www.hao123.com");
		MultiProcessManager.getManager().addProcess("test",
		"");
		MultiProcessManager.getManager().startProcess("test");
		MultiProcessManager.getManager().operaProcess("test", "notepad");

	}

}
