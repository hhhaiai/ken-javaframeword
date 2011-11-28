package com.shine.MultiProcess;

import java.io.*;

public class TestInOut implements Runnable {
	Process p = null;

	/*
	 * Process详解: ProcessBuilder.start() 和 Runtime.exec 方法创建一个本机进程， 并返回 Process
	 * 子类的一个实例，该实例可用来控制进程并获得相关信息。 Process 类提供了执行从进程输入、执行输出到进程、等待进程完成、检
	 * 查进程的退出状态以及销毁（杀掉）进程的方法。
	 * 
	 * 创建进程的方法可能无法针对某些本机平台上的特定进程很好地工作， 比如，本机窗口进程，守护进程，Microsoft Windows 上的
	 * Win16/DOS 进程， 或者 shell 脚本。创建的子进程没有自己的终端或控制台。它的所有标准 io （即 stdin、stdout 和
	 * stderr）操作都将通过三个流 (getOutputStream()、 getInputStream() 和 getErrorStream())
	 * 重定向到父进程。父进程使用这些 流来提供到子进程的输入和获得从子进程的输出。因为有些本机平台仅针对标准
	 * 输入和输出流提供有限的缓冲区大小，如果读写子进程的输出流或输入流迅速出 现失败，则可能导致子进程阻塞，甚至产生死锁。
	 * 6种方法：①destroy()、②exitValue()(此 Process 对象表示的子进程的出口值。 根据惯例，值 0
	 * 表示正常终止)③getErrorStream()④getInputStream() ⑤getOutputStream()⑥waiFor()
	 */

	/**
	 * @param args
	 */
	public TestInOut() {
		// 每个 Java 应用程序都有一个 Runtime 类实例，使应用程序能够与其运行的环境相连接。
		// 可以通过 getRuntime 方法获取当前运行时。 应用程序不能创建自己的 Runtime 类实例。

		// getRuntime()返回与当前 Java 应用程序相关的运行时对象。Runtime 类的大多数方法
		// 是实例方法，并且必须根据当前的运行时对象对其进行调用
		System.out.println("abc");
		try {
			p = Runtime.getRuntime().exec("C:\\Program Files\\Java\\jre6\\bin\\java -jar F:\\下载\\javaFramework2_5_5.jar");// 启动子进程
			new Thread(this).start(); // 启动线程
			// new Thread(new TestInOut()).start();这种写法存在问题，无线递归，实例方法被调用
			// 就又会实例化一个TestInOut对象 然后无限循环
			System.out.println("cba");
		} catch (Exception e) {
			e.printStackTrace();

		}

	}

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		TestInOut tis = new TestInOut();
		tis.send();

	}

	public void send() {
		try {
			OutputStream ops = p.getOutputStream();
			while (true) {
				// OutputStream的write方法无法写入字符串调用getBytes()方法写入单个字符
				ops.write("help/r/n".getBytes());

			}
		} catch (Exception e) {
			e.printStackTrace();

		}
	}

	public void run() {
		// TODO Auto-generated method stub
		try {
			InputStream is = p.getInputStream();
			BufferedReader br = new BufferedReader(new InputStreamReader(is));
			while (true) {
				String strLine = br.readLine();
				if (strLine != null) {
					System.out.println(strLine);
				} else {
					return;
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
