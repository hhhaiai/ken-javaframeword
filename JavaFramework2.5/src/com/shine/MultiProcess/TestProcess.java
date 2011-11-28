package com.shine.MultiProcess;

import java.io.OutputStream;
import java.io.PrintWriter;

public class TestProcess {

	/**
	 * @param args
	 */
	public static void main(String[] args) throws Exception {
		Process process = Runtime.getRuntime().exec("calc");
		OutputStream o = process.getOutputStream();
		o.write(("notepad" + "\n").getBytes());
		o.flush();
		System.out.println("123");
	}

}
