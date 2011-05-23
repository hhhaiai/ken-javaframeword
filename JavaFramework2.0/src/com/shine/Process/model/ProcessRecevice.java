package com.shine.Process.model;

import java.net.DatagramPacket;

import com.shine.framework.Udp.model.UdpRecevice;

public class ProcessRecevice extends UdpRecevice {

	public ProcessRecevice() {
		this.setKey("ProcessRecevice");
	}

	@Override
	public void recevice(String ip, int port, String data) {
		// TODO Auto-generated method stub

	}

	@Override
	public void recevice(DatagramPacket packet) {
		// TODO Auto-generated method stub

	}
}
