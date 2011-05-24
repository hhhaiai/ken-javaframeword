package com.shine.framework.ProxyServer;

import com.shine.framework.ProxyServer.utils.ProxyServerHelper;
import com.shine.framework.ProxyServer.utils.ProxyServerMap;

public class ProxyServerManager {
	public static ProxyServerManager manager = new ProxyServerManager();

	private ProxyServerMap map = new ProxyServerMap();

	private boolean state = false;

	public static ProxyServerManager getManager() {
		return manager;
	}

	/**
	 * 加入新的代理
	 * 
	 * @param host
	 * @param remoteport
	 * @param localport
	 */
	public void addProxy(String host, int remoteport, int localport) {
		addProxy(host + ":" + remoteport + ":" + localport, host, remoteport,
				localport);
	}

	/**
	 * 加入新的代理
	 * 
	 * @param name
	 * @param host
	 * @param remoteport
	 * @param localport
	 */
	public void addProxy(String name, String host, int remoteport, int localport) {
		ProxyServerHelper helper = new ProxyServerHelper(host, remoteport,
				localport);
		if (this.state) {
			helper.startProxy();
		}
		map.put(name, helper);
		helper = null;
	}

	/**
	 * 删除代理
	 * 
	 * @param name
	 */
	public void removeProxy(String name) {
		map.get(name).close();
		map.remove(name);
	}

	/**
	 * 删除代理
	 * @param host
	 * @param remotePort
	 * @param localPort
	 */
	public void removeProxy(String host, int remotePort, int localPort) {
		for (ProxyServerHelper helper : map.values()) {
			if (helper.getHost().equals(host)
					&& helper.getRemoteport() == remotePort
					&& helper.getLocalport() == localPort)
				helper.close();
		}
	}

	/**
	 * 启动代理线程
	 */
	public void startProxy() {
		if (!this.state) {
			for (ProxyServerHelper helper : map.values()) {
				if (!helper.isState())
					helper.startProxy();
			}
			this.state = true;
		}

	}

	/**
	 * 关闭代理线程
	 */
	public void closeProxy() {
		if (this.state) {
			for (ProxyServerHelper helper : map.values()) {
				if (!helper.isState())
					helper.close();
			}
			this.state = false;
		}
	}
}
