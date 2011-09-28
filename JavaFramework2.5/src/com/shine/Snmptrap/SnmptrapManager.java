package com.shine.Snmptrap;

import java.io.IOException;
import java.net.UnknownHostException;

import com.shine.Snmptrap.utils.SnmptrapHelper;
import com.shine.Snmptrap.utils.SnmptrapMap;

public class SnmptrapManager {
	private static SnmptrapManager manager = null;

	private SnmptrapMap map = new SnmptrapMap();

	public static SnmptrapManager getManager() {
		if (manager == null)
			manager = new SnmptrapManager();
		return manager;
	}

	/**
	 * 加入snmp trap接收器
	 * 
	 * @param tag
	 * @param host
	 * @param port
	 * @param threadSize
	 */
	public void addRecevice(String tag, String host, int port, int threadSize) {
		try {
			if(map.containsKey("tag")){
				System.out.println("已经初始化了相关接收器!!!");
				
			}
				
			SnmptrapHelper helper = new SnmptrapHelper();
			helper.init(host, port, threadSize);
			map.put(tag, helper);
		} catch (UnknownHostException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	/**
	 * 停止接收器
	 */
	public void stopRecevice() {
		try {
			for (SnmptrapHelper helper : map.values()) {
				helper.stop();
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	/**
	 * 停止其中一个接收器
	 * 
	 * @param tag
	 */
	public void stopRecevice(String tag) {
		try {
			if (map.get(tag) != null)
				map.get(tag).stop();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public void loadTraslator() {

	}
}
