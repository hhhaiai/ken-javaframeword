package com.shine.framework.ProxyServer;

public class Example {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
//		ProxyServerManager.getManager().addProxy("192.168.2.18", 8888, 9999);
//		ProxyServerManager.getManager().startProxy();
		
		ProxyServerManager.getManager().addProxy("192.168.2.18", 8888, 9999);
		//ProxyServerManager.getManager().addProxy("192.168.2.10", 8888, 9990);
		ProxyServerManager.getManager().startProxy();
	}

}
