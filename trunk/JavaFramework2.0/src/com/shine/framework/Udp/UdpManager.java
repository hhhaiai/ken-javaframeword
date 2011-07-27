package com.shine.framework.Udp;

import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.net.SocketException;
import java.util.HashMap;
import java.util.Map;

import com.shine.framework.Udp.model.UdpRecevice;
import com.shine.framework.Udp.utils.UdpHelperMap;
import com.shine.framework.Udp.utils.UdpSocketHelper;

public class UdpManager {
	private static UdpManager manager = new UdpManager();

	private UdpHelperMap map = new UdpHelperMap();

	public static UdpManager getManager() {
		return manager;
	}

	/**
	 * 加入udp监听
	 * 
	 * @param host
	 * @param port
	 * @return
	 */
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

	/**
	 * 加入udp监听
	 * 
	 * @param port
	 * @return
	 */
	public Boolean addBind(int port) {
		return addBind("127.0.0.1", port);
	}

	/**
	 * 加入接收器
	 * 
	 * @param port
	 * @param udpReceviceIf
	 */
	public void addRecevice(int port, UdpRecevice udpReceviceIf) {
		map.addRecevice(port, udpReceviceIf);
	}

	/**
	 * 启动监听线程
	 */
	public void startRecevice() {
		for (UdpSocketHelper helper : map.values()) {
			helper.startReceive();
		}
	}

	/**
	 * 启动监听线程
	 * 
	 * @param port
	 */
	public void startRecevice(int port) {
		map.get(port).startReceive();
	}

	/**
	 * 所有端口暂停接收数据 抛弃数据包
	 */
	public void pauseRecevice() {
		for (UdpSocketHelper helper : map.values()) {
			helper.setReceviceable(false);
		}
	}

	/**
	 * 指定端口暂停接收数据 抛弃相关数据包
	 * 
	 * @param port
	 */
	public void pauseRecevice(int port) {
		map.get(port).setReceviceable(false);
	}

	/**
	 * 关闭所有监听线程
	 */
	public void stopReceivce() {
		for (UdpSocketHelper helper : map.values()) {
			helper.close();
		}
	}

	/**
	 * 关闭所有监听线程
	 * 
	 * @param port
	 */
	public void stopRecevice(int port) {
		map.get(port).close();
	}

	/**
	 * 发送udp数据包
	 * 
	 * @param port
	 * @param ip
	 * @param recevicePort
	 * @param data
	 * @throws IOException
	 */
	public void send(int port, String ip, int recevicePort, String data)
			throws IOException {
		map.get(port).send(ip, recevicePort, data);
	}

	/**
	 * 群发数据
	 * 
	 * @param port
	 * @param recevicePort
	 * @param data
	 * @param ips
	 * @throws IOException
	 */
	public void sendIpGroup(int port, int recevicePort, String data,
			String... ips) throws IOException {
		for (String ip : ips) {
			map.get(port).send(ip, recevicePort, data);
		}
	}
}
