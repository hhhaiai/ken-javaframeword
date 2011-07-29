package com.shine.framework.IIS;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class Example {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		//IISUtils.getIISDataInfo("192.168.2.18", "public", 161);
		
		//IISUtils.getIISConnectionInfo("192.168.2.18", "public", 161);

		IISUtils.getIISRequestInfo("192.168.2.18", "public", 161);
	}

}
