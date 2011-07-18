package com.shine.Netflow.receiver;

import java.net.DatagramPacket;

import com.shine.framework.Udp.model.UdpRecevice;

public class NetflowRecevice extends UdpRecevice {

	public NetflowRecevice() {
		super();

		this.setKey("netFlow");
	}

	@Override
	public void recevice(String ip, int port, String data) {
		System.out.println(ip);
		System.out.println("=======");
		System.out.println(port);
		System.out.println("=======");
		System.out.println(data);
	}

	@Override
	public void recevice(DatagramPacket packet) {
		// TODO Auto-generated method stub

	}

}
