package com.shine.framework.Udp;

import com.shine.framework.Udp.model.PrintRecevice;

public class Example {

	/**
	 * @param args
	 */
	public static void main(String[] args) throws Exception {

		UdpManager.getManager("127.0.0.1", 8888).addRecevice("print",
				new PrintRecevice());
		UdpManager.getManager().startReceive();

		UdpManager.getManager().send("127.0.0.1", 8888, "123");
	}

}
