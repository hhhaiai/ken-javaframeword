package com.shine.framework.OOWeb;

import net.sf.ooweb.http.Server;
import net.sf.ooweb.http.pygmy.OowebServer;

public class Example {

	/**
	 * @param args
	 */
	public static void main(String[] args) throws Exception {
		Server s = new OowebServer();
		s.addController(new HelloWorld());
		s.start();
	}

}
