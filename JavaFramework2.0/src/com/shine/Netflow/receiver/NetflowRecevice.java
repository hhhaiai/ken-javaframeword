package com.shine.Netflow.receiver;

import java.net.DatagramPacket;
import java.util.ArrayList;
import java.util.List;

import com.shine.Netflow.model.RawNetFlow;
import com.shine.Netflow.threadModel.ProcessThreadModel;
import com.shine.Netflow.translator.TranslatorHelper;
import com.shine.framework.ThreadPoolUtil.ThreadPoolManager;
import com.shine.framework.Udp.model.UdpRecevice;

public class NetflowRecevice extends UdpRecevice {

	private int cache = 20;
	private int threadSize = 20;
	private List<byte[]> list = new ArrayList<byte[]>();

	public NetflowRecevice() {
		super();

		this.setKey("netFlow");
		initThreadPool();
	}

	public NetflowRecevice(int cache) {
		super();

		this.setKey("netFlow");
		this.setCache(cache);
		initThreadPool();
	}

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

	@Override
	public void recevice(String ip, int port, byte[] data) {
		System.out.println(list.size());
		if (list.size() > cache) {
			ThreadPoolManager.getManager().getIdleThread().setValues(list);
			list.clear();
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
