package com.shine.Sniffer;

/**
 * sniffe捉包分析软件
 * 
 * @author viruscodecn@gmail.com
 * 
 */
public class SniffeManager {
	private static SniffeManager manager = null;

	private int threadSize = 20;
	private int maxThreadSize = 200;

	private int cache = 20;
	private int maxCache = 1000;
	private int incomeCache = 10;

	public static SniffeManager getManager() {
		if (manager == null)
			manager = new SniffeManager();
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
