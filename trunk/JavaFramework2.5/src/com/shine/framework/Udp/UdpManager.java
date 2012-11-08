package com.shine.framework.Udp;

import java.io.IOException;

import com.shine.framework.Udp.model.UdpRecevice;
import com.shine.framework.Udp.utils.UdpHelperMap;
import com.shine.framework.Udp.utils.UdpSocketHelper;
import com.shine.framework.Udp.utils.UdpUtil;

/**
 * udp操作类
 * 
 * @author viruscodecn@gmail.com
 * 
 */
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
	 * 加入接收器（针对多网卡）
	 * 
	 * @param host
	 * @param port
	 * @param udpReceviceIf
	 */
	public void addRecevice(String host, int port, UdpRecevice udpReceviceIf) {
		map.addRecevice(host, port, udpReceviceIf);
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
		startRecevice("127.0.0.1", port);
	}

	/**
	 * 启动监听线程
	 * 
	 * @param host
	 * @param port
	 */
	public void startRecevice(String host, int port) {
		if (UdpUtil.createKey(host, port) != null)
			map.get(UdpUtil.createKey(host, port)).startReceive();
		else
			System.err.println("start_不存在" + host + "和端口" + port);
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
		pauseRecevice("127.0.0.1", port);
	}

	/**
	 * 指定端口暂停接受数据，抛弃相关数据包
	 * 
	 * @param host
	 * @param port
	 */
	public void pauseRecevice(String host, int port) {
		if (UdpUtil.createKey(host, port) != null)
			map.get(UdpUtil.createKey(host, port)).setReceviceable(false);
		else
			System.err.println("pause_不存在" + host + "和端口" + port);
	}

	/**
	 * 所有端口恢复接收数据 抛弃数据包
	 */
	public void resumeRecevice() {
		for (UdpSocketHelper helper : map.values()) {
			helper.setReceviceable(true);
		}
	}

	/**
	 * 指定端口恢复接收数据 抛弃相关数据包
	 * 
	 * @param port
	 */
	public void resumeRecevice(int port) {
		resumeRecevice("127.0.0.1", port);
	}

	/**
	 * 指定端口恢复接收数据 抛弃相关数据包
	 * 
	 * @param host
	 * @param port
	 */
	public void resumeRecevice(String host, int port) {
		if (UdpUtil.createKey(host, port) != null)
			map.get(UdpUtil.createKey(host, port)).setReceviceable(true);
		else
			System.err.println("resume_不存在" + host + "和端口" + port);
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
	 * 关闭指定监听线程
	 * 
	 * @param port
	 */
	public void stopRecevice(int port) {
		stopRecevice("127.0.0.1", port);
	}

	/**
	 * 关闭指定监听线程
	 * 
	 * @param host
	 * @param port
	 */
	public void stopRecevice(String host, int port) {
		if (UdpUtil.createKey(host, port) != null)
			map.get(UdpUtil.createKey(host, port)).close();
		else
			System.err.println("stop_不存在" + host + "和端口" + port);
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
		send("127.0.0.1", port, ip, recevicePort, data);
	}

	/**
	 * 发送udp数据包
	 * 
	 * @param host
	 * @param port
	 * @param ip
	 * @param recevicePort
	 * @param data
	 * @throws IOException
	 */
	public void send(String host, int port, String ip, int recevicePort,
			String data) throws IOException {
		map.get(UdpUtil.createKey(host, port)).send(ip, recevicePort, data);
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
