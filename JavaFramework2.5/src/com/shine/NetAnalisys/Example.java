package com.shine.NetAnalisys;

import com.shine.NetAnalisys.model.NetPortCallBack;
import com.shine.NetAnalisys.model.NetScanCallBack;
import com.shine.framework.ThreadPoolUtil.ThreadPoolManager;

public class Example {
	public static void main(String args[]) {
		NetAnalisysManager.getManager().setNetScanSize(100);
		NetAnalisysManager.getManager().initThreadModel();
		
		NetScanCallBack callback = new NetScanCallBack();
		NetAnalisysManager.getManager().startNetScan("192.168.11.1",
				"192.168.11.255", callback, "callback");
		
	}
}
