package com.shine.Netflow;

import com.shine.Netflow.receiver.NetflowRecevice;
import com.shine.framework.Udp.UdpManager;
import com.shine.framework.Udp.model.PrintRecevice;

/**
 * 
 * @author viruscodecn@gmail.com
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
		UdpManager.getManager().addRecevice(port, new NetflowRecevice(cache));
		UdpManager.getManager().startRecevice();
	}
}
