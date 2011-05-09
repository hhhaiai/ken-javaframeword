package com.shine.framework.ThreadPoolUtil.util;

import java.util.HashMap;

public class ThreadPool extends HashMap<String, SuperThread> {
	private int maxThread = 500;
	private int idleThread = 10;
	private int threadCount = 50;

}
