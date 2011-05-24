package com.shine.framework.ProxyServer;

public class Example {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
//		ProxyServerManager.getManager().addProxy("192.168.2.18", 8888, 9999);
//		ProxyServerManager.getManager().startProxy();
		
		ProxyServerManager.getManager().addProxy("www.cnbeta.com", 80, 9999);
		ProxyServerManager.getManager().startProxy();
	}

}
