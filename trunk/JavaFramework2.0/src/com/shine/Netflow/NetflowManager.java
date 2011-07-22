package com.shine.Netflow;

import com.shine.Netflow.receiver.NetflowRecevice;
import com.shine.Netflow.threadModel.ProcessThreadModel;
import com.shine.framework.ThreadPoolUtil.ThreadPoolManager;
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
	public void startReceiver(int port, int cache, int threadSize) {
		initThreadPool(threadSize);

		UdpManager.getManager().addBind(port);
		UdpManager.getManager().addRecevice(port, new NetflowRecevice(cache));
		UdpManager.getManager().startRecevice();
	}

	/**
	 * 初始化线程池
	 * 
	 * @param threadSize
	 */
	private void initThreadPool(int threadSize) {
		for (int i = 0; i < threadSize; i++) {
			try {
				ProcessThreadModel model = new ProcessThreadModel();
				model.setThreadName("process" + i);
				model.setTimeOut(100);
				model.setType("process");
				ThreadPoolManager.getManager().addThread(model);
				model = null;
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		ThreadPoolManager.getManager().startThreadPool();
	}
}
