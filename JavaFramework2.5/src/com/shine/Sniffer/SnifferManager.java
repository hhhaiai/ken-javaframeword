package com.shine.Sniffer;

/**
 * sniffe捉包分析软件
 * 
 * @author viruscodecn@gmail.com
 * 
 */
public class SnifferManager {
	private static SnifferManager manager = null;

	private int threadSize = 20;
	private int maxThreadSize = 200;

	private int cache = 20;
	private int maxCache = 1000;
	private int incomeCache = 10;

	public static SnifferManager getManager() {
		if (manager == null)
			manager = new SnifferManager();
		return manager;
	}

	public void init(String xmlPath) {

	}

	public void startSniffe() {

	}

	public void stopSniffe() {

	}

	public void startSniffeThread() {

	}

	public void addSniffeHandle() {

	}
}
