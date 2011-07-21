package com.shine.Netflow.receiver;

import java.net.DatagramPacket;
import java.util.ArrayList;
import java.util.List;

import com.shine.Netflow.model.RawNetFlow;
import com.shine.Netflow.translator.TranslatorHelper;
import com.shine.framework.Udp.model.UdpRecevice;

public class NetflowRecevice extends UdpRecevice {

	private int cache = 20;

	public NetflowRecevice() {
		super();

		this.setKey("netFlow");
	}

	public NetflowRecevice(int cache) {
		super();

		this.setKey("netFlow");
		this.setCache(cache);
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
		TranslatorHelper.translator(1, data);
		
	}

	public int getCache() {
		return cache;
	}

	public void setCache(int cache) {
		this.cache = cache;
	}

}
