package com.shine.framework.Udp.model;

import java.net.DatagramPacket;

public class PrintRecevice extends UdpRecevice {

	public PrintRecevice() {
		super();

		this.setKey("testPrint");
	}

	@Override
	public void recevice(DatagramPacket packet) {
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
	public void recevice(String ip, int port, byte[] data) {
	}
}
