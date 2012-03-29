package com.shine.MultiProcess;

public class TomcatExample {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		MultiProcessManager.getManager().setJvmPath(
				"C:\\Program Files\\Java\\jre6\\bin\\java");
		MultiProcessManager
				.getManager()
				.addProcess(
						"test",
						"E:\\Program Files\\Apache Software Foundation\\sunshine-tomcat-7.0.5\\bin\\catalina.bat start");
		MultiProcessManager.getManager().startProcess("test");
		//MultiProcessManager.getManager().closeProcess("test");
		System.out.println("close");

	}

}
