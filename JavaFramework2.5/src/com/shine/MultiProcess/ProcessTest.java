package com.shine.MultiProcess;

import java.io.BufferedReader;
import java.io.InputStreamReader;

public class ProcessTest {

	/**
	 * @param args
	 */
	public static void main(String[] args) throws Exception {
		System.out.println("process start");
		BufferedReader bfr = new BufferedReader(
				new InputStreamReader(System.in));
		while (true) {
			String line = bfr.readLine();
			if (line != null) {
				System.out.println("order:" + line);
			} else {
				return;
			}
		}
	}

}
