package com.shine.MultiProcess;

import java.io.*;

public class MyTest {

	/**
	 * @param args
	 */
	public static void main(String[] args) throws Exception {
		System.out.println("123");
		// TODO Auto-generated method stub
		// 定义在循环外部 只创建一个对象
		BufferedReader bfr = new BufferedReader(
				new InputStreamReader(System.in));
		while (true) {
			// System.in “标准”输入流。此流已打开并准备提供输入数据。
			// 通常，此流对应于键盘输入或者由主机环境或用户指定的另一个输入源

			String strLine = bfr.readLine();
			if (strLine != null) {
				System.out.println("hi" + strLine);
			} else {
				return;
			}
		}

	}

}
