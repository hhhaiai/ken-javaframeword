package com.shine.Netflow;

import com.shine.Netflow.receiver.NetflowRecevice;
import com.shine.framework.Udp.UdpManager;
import com.shine.framework.Udp.model.PrintRecevice;

/**
 * Netflow接收解析器
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

	/**
	 * 启动netflow接收
	 * 
	 * @param port
	 *            接收端口
	 * @param cache
	 *            数据包缓存
	 */
	public void startReceiver(int port, int cache) {
		UdpManager.getManager().addBind(port);
		UdpManager.getManager().addRecevice(port, new NetflowRecevice(cache));
		UdpManager.getManager().startRecevice();
	}
}
