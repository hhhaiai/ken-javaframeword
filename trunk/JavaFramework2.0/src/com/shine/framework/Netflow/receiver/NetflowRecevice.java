package com.shine.Netflow.receiver;

import java.net.DatagramPacket;

import com.shine.Netflow.translator.TranslatorHelper;
import com.shine.framework.Udp.model.UdpRecevice;

public class NetflowRecevice extends UdpRecevice {

	public NetflowRecevice() {
		super();

		this.setKey("netFlow");
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

}
