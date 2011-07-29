package com.shine.framework.ProxyServer;

import java.util.List;
import java.util.Map;

import org.dom4j.Element;

import com.shine.framework.ProxyServer.utils.ProxyServerHelper;
import com.shine.framework.ProxyServer.utils.ProxyServerMap;
import com.shine.framework.core.util.XmlUitl;

/**
 * 代理服务器
 * @author viruscodecn@gmail.com
 * @blog http://blog.csdn.net/arjick/archive/2011/05/27/6450906.aspx
 *
 */
public class ProxyServerManager {
	public static ProxyServerManager manager = new ProxyServerManager();

	private ProxyServerMap map = new ProxyServerMap();

	private boolean state = false;

	public static ProxyServerManager getManager() {
		return manager;
	}

	/**
	 * 加入代理
	 * @param configPath
	 */
	public void addProxy(String configPath) {
		try {
			List<Element> list = XmlUitl.getAllElementByPath(configPath,
					"proxy");

			for (Element ele : list) {
				Map<String, String> map = XmlUitl.getAllAttribute(ele);
				addProxy(map.get("name"), map.get("host"), Integer.parseInt(map
						.get("remoteport")), Integer.parseInt(map
						.get("localport")));
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
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
	 * 
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
