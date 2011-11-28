package com.shine.MultiProcess;

import java.io.BufferedOutputStream;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;

public class TestProcess {

	/**
	 * @param args
	 */
	public static void main(String[] args) throws Exception {
		Process process = Runtime.getRuntime().exec("calc");
		PrintWriter writer = new PrintWriter(new OutputStreamWriter(
				new BufferedOutputStream(process.getOutputStream())), true);
		writer.println("notepad");
		writer.flush();
		writer.close();

		process.waitFor();
	}

}
