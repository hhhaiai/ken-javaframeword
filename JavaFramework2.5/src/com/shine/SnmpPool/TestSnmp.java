package com.shine.SnmpPool;

public class TestSnmp {
	
	public static void main(String args[]) throws Exception{
		//首先初始化五个线程放入线程池中，启动并等待任务
		SnmpPoolManager.getManager().init(5);
		
		//初始化采集池(有连接器测试)
		//SnmpPoolManager.getManager().addSnmp("Port-oid", "192.168.2.18","public", 161, 2);
		
		//启动有采集器,即开始利用Snmp采集数据（无连接器测试）
		//SnmpPoolManager.getManager().getSnmpData("server","192.168.2.18","public", 161,
		//		"1.3.6.1.2.1.1.1.0", new TestSnmp(),
		//		"testThread");
		
		SnmpPoolManager.getManager().getSnmpData("192.168.2.18",161,"1.3.6.1.2.1.1.1.0","Port-oid");
			
	}
}
