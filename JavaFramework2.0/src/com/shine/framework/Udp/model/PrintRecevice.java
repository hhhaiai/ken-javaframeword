package com.shine.framework.Udp.model;

public class PrintRecevice extends UdpReceviceIf {

	public PrintRecevice() {
		super();

		this.setKey("testPrint");
	}

	@Override
	public void recevice(String ip, int port, String data) {
		System.out.println(ip);
		System.out.println("=======");
		System.out.println(port);
		System.out.println("=======");
		System.out.println(data);
	}

}
