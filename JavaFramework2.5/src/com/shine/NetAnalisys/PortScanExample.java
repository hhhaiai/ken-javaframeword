package com.shine.NetAnalisys;

import com.shine.NetAnalisys.model.NetPortCallBack;
import com.shine.framework.ThreadPoolUtil.ThreadPoolManager;

/**
 * 端口扫描例子
 * 
 * @author viruscodecn@gmail.com
 * 
 */
public class PortScanExample {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		NetAnalisysManager.getManager().setNetPortSize(100);
		NetAnalisysManager.getManager().initThreadModel();
		

		NetPortCallBack netPortCB = new NetPortCallBack();
		NetAnalisysManager.getManager().startNetPort("127.0.0.1", 1, 1024,
				netPortCB, "callback");
	}

}
