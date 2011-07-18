package com.shine.Netflow;

import com.shine.framework.Udp.UdpManager;
import com.shine.framework.Udp.model.PrintRecevice;

/**
 * 
 * @author 123
 * @lib jnca-beta-0.91.jar
 */
public class NetflowManager {
	private static NetflowManager manager = new NetflowManager();

	public static NetflowManager getManager() {
		return manager;
	}

	public void startReceiver() {

	}

	public void startReceiver(String configPath) {

	}

	public void startReceiver(int port, int cache) {
		UdpManager.getManager().addBind(port);
		UdpManager.getManager().addRecevice(port, new PrintRecevice());
		UdpManager.getManager().startRecevice();
	}
}
