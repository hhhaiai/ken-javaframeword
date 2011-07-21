package com.shine.Netflow.receiver;

import java.net.DatagramPacket;
import java.util.ArrayList;
import java.util.List;

import com.shine.Netflow.model.RawNetFlow;
import com.shine.Netflow.threadModel.ProcessThreadModel;
import com.shine.Netflow.translator.TranslatorHelper;
import com.shine.framework.ThreadPoolUtil.ThreadPoolManager;
import com.shine.framework.Udp.model.UdpRecevice;

/**
 * netflow接收器 用于接收并且解析netflow
 * 
 * @author viruscodecn@gmail.com
 * 
 */
public class NetflowRecevice extends UdpRecevice {

	private int cache = 20;
	private int threadSize = 20;
	private List<byte[]> list = new ArrayList<byte[]>();

	/**
	 * 初始接收器
	 */
	public NetflowRecevice() {
		super();

		this.setKey("netFlow");
		initThreadPool();
	}

	/**
	 * 初始化接收器
	 * 
	 * @param cache
	 */
	public NetflowRecevice(int cache) {
		super();

		this.setKey("netFlow");
		this.setCache(cache);
		initThreadPool();
	}

	/**
	 * 初始化处理线程池
	 */
	private void initThreadPool() {
		for (int i = 0; i < threadSize; i++) {
			try {
				ProcessThreadModel model = new ProcessThreadModel();
				model.setThreadName("process" + i);
				model.setTimeOut(1000);
				ThreadPoolManager.getManager().addThread(model);
				model = null;
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		ThreadPoolManager.getManager().startThreadPool();
	}

	@Override
	public void recevice(String ip, int port, String data) {
		// TODO Auto-generated method stub
	}

	@Override
	public void recevice(DatagramPacket packet) {
		// TODO Auto-generated method stub
	}

	/**
	 * 接收到数据
	 */
	@Override
	public void recevice(String ip, int port, byte[] data) {
		System.out.println(list.size());
		if (list.size() > cache) {
			if (ThreadPoolManager.getManager().getIdleThread() != null) {
				ThreadPoolManager.getManager().getIdleThread().setValues(list);
				list.clear();
			}
		} else {
			list.add(data);
		}
	}

	public int getCache() {
		return cache;
	}

	public void setCache(int cache) {
		this.cache = cache;
	}

}
