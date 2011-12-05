package com.shine.NetAnalisys;

import com.shine.NetAnalisys.model.NetPortCallBack;
import com.shine.NetAnalisys.model.NetScanCallBack;

public class Example {
	public static void main(String args[]) {
		NetAnalisysManager.getManager().initThreadModel();
		
		NetScanCallBack callback = new NetScanCallBack();
		NetAnalisysManager.getManager().startNetScan("192.168.11.1", "192.168.11.255", callback, "callback");
		NetPortCallBack netPortCB = new NetPortCallBack();
		NetAnalisysManager.getManager().startNetPort("127.0.0.1", 3306, 8909, netPortCB, "callback");
	}
}
