package com.shine.framework.Udp;

import com.shine.framework.Udp.model.PrintRecevice;

public class Example {

	/**
	 * @param args
	 */
	public static void main(String[] args) throws Exception {

		UdpManager.getManager().addBind(8888);
		UdpManager.getManager().addRecevice(8888, new PrintRecevice());
		UdpManager.getManager().startRecevice();

		UdpManager.getManager().send(8888,"127.0.0.1", 8888, "123");
	}

}
