package com.shine.SnmpPool;

public class AsynchronousOidValueExample {

	public void testThread(String s) {
		System.out.println("test" + s);
	}

	/**
	 * 异步获取数据例子
	 * 
	 * @param args
	 * @throws Exception
	 */
	public static void main(String[] args) throws Exception {
		SnmpPoolManager.getManager().init(2);

		SnmpPoolManager.getManager().addSnmp("server", "192.168.2.18",
				"public", 161, 2);

		SnmpPoolManager.getManager().getAsynchronousOidValue("server",
				"1.3.6.1.2.1.1.1.0", new AsynchronousOidValueExample(),
				"testThread");
	}

}
