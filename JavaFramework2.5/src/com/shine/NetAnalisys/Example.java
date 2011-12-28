package com.shine.NetAnalisys;

import com.shine.NetAnalisys.model.NetPortCallBack;
import com.shine.NetAnalisys.model.NetScanCallBack;

public class Example {
	public static void main(String args[]) {
		NetAnalisysManager.getManager().setNetScanSize(10);
		NetAnalisysManager.getManager().initThreadModel();
		
		long curTime = System.currentTimeMillis();
		NetScanCallBack callback = new NetScanCallBack();
		NetAnalisysManager.getManager().startNetScan("192.168.11.1", "192.168.11.255", callback, "callback");
		for (String ip : callback.getIpList()) {
			System.out.println("接收IP" + ip + "可ping通");
		}
		System.out.println("执行时间" + (System.currentTimeMillis() - curTime));
		
		
//		NetPortCallBack netPortCB = new NetPortCallBack();
//		NetAnalisysManager.getManager().startNetPort("127.0.0.1", 1, 65535, netPortCB, "callback");
	}
}
