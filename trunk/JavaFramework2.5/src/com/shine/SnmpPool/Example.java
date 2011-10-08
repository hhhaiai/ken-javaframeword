package com.shine.SnmpPool;

public class Example {

	/**
	 * @param args
	 * @throws Exception
	 */
	public static void main(String[] args) throws Exception {
		SnmpPoolManager.getManager().addSnmp("server", "192.168.2.18",
				"public", 161, 2);
		System.out.println(SnmpPoolManager.getManager().getOidValue("server",
				"1.3.6.1.2.1.1.1.0"));
	}

}
