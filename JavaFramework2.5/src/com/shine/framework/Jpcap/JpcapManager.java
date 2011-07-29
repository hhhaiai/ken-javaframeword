package com.shine.framework.Jpcap;

import com.shine.framework.Jpcap.model.JpcapPackReceiver;

import jpcap.JpcapCaptor;
import jpcap.NetworkInterface;
import jpcap.NetworkInterfaceAddress;

/**
 * java 采集jpcap数据
 * 
 * @author viruscodecn@gmail.com
 * @project JavaFramework 1.0 2011-4-26
 * @blog http://blog.csdn.net/arjick/archive/2009/09/06/4525474.aspx
 */
public class JpcapManager {
	public static void startMonitor() throws Exception {
		// TODO 自动生成方法存根
		NetworkInterface[] devices = JpcapCaptor.getDeviceList(); // .getDeviceList();.
		// for (int i =0; i<devices.length;i++) {
		int a = 0;
		// try {
		/* 本地网络信息 */
		byte[] b = devices[1].mac_address; // 网卡物理地址
		// }
		// catch() {}
		System.out.print("网卡MAC : 00");
		for (int j = 0; j < b.length; j++) {
			// a=a<<8;
			a = b[j];
			a = a << 24;
			a = a >>> 24;
			System.out.print(Integer.toHexString(a));
		}
		System.out.println();
		NetworkInterfaceAddress[] k = devices[1].addresses;

		// System.out.println("网卡MAC : "+Integer.toHexString(a));
		for (int n = 0; n < k.length; n++) {
			System.out.println("本机IP地址 : " + k[n].address); // 本机IP地址
			System.out.println("子网掩码   : " + k[n].subnet); // 子网掩码
		}
		System.out.println("网络连接类型 : " + devices[1].datalink_description);
		// }
		NetworkInterface deviceName = devices[1];
		/* 将网卡设为混杂模式下用网络设备deviceName */
		JpcapCaptor jpcap = JpcapCaptor.openDevice(deviceName, 2000, true, 1); // openDevice(deviceName,1028,false,1);
		jpcap.loopPacket(-1, new JpcapPackReceiver());
	}
}
