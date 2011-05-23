package com.shine.framework.Udp;

import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.net.SocketException;
import java.util.HashMap;
import java.util.Map;

import com.shine.framework.Udp.model.UdpReceviceIf;
import com.shine.framework.Udp.utils.UdpHelperMap;
import com.shine.framework.Udp.utils.UdpSocketHelper;

public class UdpManager {
	private static UdpManager manager = new UdpManager();

	private UdpHelperMap map = new UdpHelperMap();

	public static UdpManager getManager() { 
		return manager;
	}

	public Boolean addBind(String host, int port) {
		try {
			UdpSocketHelper helper = new UdpSocketHelper(host, port);
			map.putHelper(helper);
			return true;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return false;
	}

	public void addRecevice(String helperName, UdpReceviceIf udpReceviceIf) {
		map.addRecevice(helperName, udpReceviceIf);
	}
}
