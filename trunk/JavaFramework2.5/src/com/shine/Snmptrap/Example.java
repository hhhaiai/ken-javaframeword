package com.shine.Snmptrap;

public class Example {

	/**
	 * snmp trap 接收测试
	 * 
	 * @param args
	 */
	public static void main(String[] args) {
		SnmptrapManager.getManager().addRecevice("test","127.0.0.1", 162, 10);
        System.err.println("Snmp trap 启动成功!!!");
	}

}
