package com.shine.MultiProcess;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.PrintWriter;

public class TestProcess {

	/**
	 * @param args
	 */
	public static void main(String[] args) throws Exception {
		BufferedReader br = null;
		InputStreamReader isr = null;
		Process process = Runtime.getRuntime().exec("cmd /c calc");
		OutputStream o = process.getOutputStream();
		o.write(("notepad" + "\n").getBytes());
		o.flush();
		System.out.println("123");
		
		isr = new InputStreamReader(process.getInputStream(), "utf-8");
		br = new BufferedReader(isr);
		String line = br.readLine();
		while (line != null) {
			System.out.println(line + "\r\n");
			line = br.readLine();
		}
	}

}
