package com.shine.framework.Udp.utils;

import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.net.SocketException;
import java.util.HashMap;
import java.util.Map;

import com.shine.framework.Udp.model.UdpRecevice;

public class UdpSocketHelper {
	private byte[] buffer = new byte[2048];

	private DatagramSocket ds = null;

	private DatagramPacket packet = null;

	private InetSocketAddress socketAddress = null;

	private String orgIp;

	// 接收数据接口
	private Map<String, UdpRecevice> reciveInterface;

	// 接收数据线程
	private ReceviceRunnable receviceRunnable;

	private boolean receviceable = true;

	public UdpSocketHelper() {
	}

	/**
	 * 初始化数据
	 * 
	 * @param host
	 * @param port
	 * @throws SocketException
	 */
	public UdpSocketHelper(String host, int port) throws SocketException {
		bind(host, port);
	}

	/**
	 * 绑定监听地址和端口.
	 * 
	 * @param host
	 *            主机IP
	 * @param port
	 *            端口
	 * @throws SocketException
	 */
	public final void bind(String host, int port) throws SocketException {
		socketAddress = new InetSocketAddress(host, port);
		ds = new DatagramSocket(socketAddress);
	}

	/**
	 * 监听
	 * 
	 * @throws SocketException
	 */
	public final void bind() throws SocketException {
		if (socketAddress != null) {
			ds = new DatagramSocket(socketAddress);
		} else {
			System.out.println("请设置host和port!!");
		}
	}

	/**
	 * 获取发送过来的IP
	 * 
	 * @return
	 */
	public final String getOrgIp() {
		return orgIp;
	}

	/**
	 * 设置超时时间，该方法必须在bind方法之后使用.
	 * 
	 * @param timeout
	 *            超时时间
	 * @throws Exception
	 */
	public final void setSoTimeout(int timeout) throws Exception {
		ds.setSoTimeout(timeout);
	}

	/**
	 * 获得超时时间.
	 * 
	 * @return 返回超时时间.
	 * @throws Exception
	 */
	public final int getSoTimeout() throws Exception {
		return ds.getSoTimeout();
	}

	/**
	 * 启动接收数据包
	 */
	public final void startReceive() {
		if (receviceRunnable == null) {
			receviceRunnable = new ReceviceRunnable();
			receviceRunnable.setHelper(this);
			receviceRunnable.start();
		}
	}

	/**
	 * 加入接收器
	 * 
	 * @param udpReceviceIf
	 */
	public void addRecevice(UdpRecevice udpReceviceIf) {
		this.addRecevice(udpReceviceIf.getKey(), udpReceviceIf);
	}

	/**
	 * 加入接收器
	 * 
	 * @param key
	 * @param udpReceviceIf
	 */
	public void addRecevice(String key, UdpRecevice udpReceviceIf) {
		if (reciveInterface == null)
			reciveInterface = new HashMap<String, UdpRecevice>();
		reciveInterface.put(key, udpReceviceIf);
	}

	/**
	 * 接收数据包，该方法会造成线程阻塞.
	 * 
	 * @return 返回接收的数据串信息
	 * @throws IOException
	 */
	public final void receive() throws IOException {
		packet = new DatagramPacket(buffer, buffer.length);
		ds.receive(packet);
		orgIp = packet.getAddress().getHostAddress();
		String info = new String(packet.getData(), 0, packet.getLength());
		if (reciveInterface != null) {
			for (UdpRecevice udpReceviceIf : reciveInterface.values()) {
				udpReceviceIf.recevice(packet);
				udpReceviceIf.recevice(orgIp, packet.getPort(), info);
				udpReceviceIf.recevice(orgIp, packet.getPort(), buffer);
			}
		}
	}

	/**
	 * 发送信息
	 * 
	 * @param ip
	 * @param port
	 * @param info
	 * @throws IOException
	 */
	public final void send(String ip, int port, String info) throws IOException {
		DatagramPacket dp = new DatagramPacket(buffer, buffer.length,
				InetAddress.getByName(ip), port);
		dp.setData(info.getBytes());
		ds.send(dp);
	}

	/**
	 * 设置报文的缓冲长度.
	 * 
	 * @param bufsize
	 *            缓冲长度
	 */
	public final void setLength(int bufsize) {
		packet.setLength(bufsize);
	}

	/**
	 * 获得发送回应的IP地址.
	 * 
	 * @return 返回回应的IP地址
	 */
	public final InetAddress getResponseAddress() {
		return packet.getAddress();
	}

	/**
	 * 获得回应的主机的端口.
	 * 
	 * @return 返回回应的主机的端口.
	 */
	public final int getResponsePort() {
		return packet.getPort();
	}

	/**
	 * 获取监控的端口
	 * 
	 * @return
	 */
	public final int getBindPort() {
		return this.socketAddress.getPort();
	}

	/**
	 * 获取运行状态
	 * 
	 * @return
	 */
	public final boolean getState() {
		if (ds == null)
			return false;

		if (ds.isClosed())
			return false;
		return true;
	}

	/**
	 * 关闭udp监听口.
	 * 
	 */
	public final void close() {
		try {
			if (getState())
				ds.close();
		} catch (Exception ex) {
			ex.printStackTrace();
		}
	}

	/**
	 * 获取key
	 * 
	 * @return
	 */
	public String getKey() {
		if (socketAddress != null)
			return UdpUtil.createKey(socketAddress.getAddress()
					.getHostAddress(), socketAddress.getPort());
		else
			return null;
	}

	public boolean isReceviceable() {
		return receviceable;
	}

	public void setReceviceable(boolean receviceable) {
		this.receviceable = receviceable;
	}

}

class ReceviceRunnable extends Thread {
	private UdpSocketHelper helper;

	public void run() {
		try {
			while (true) {
				// 检测接受器是否初始化
				if (helper != null)
					// 检测接收器是否启动
					if (helper.getState())
						// 检测接收器是否抛弃数据包
						if (helper.isReceviceable())
							helper.receive();
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public UdpSocketHelper getHelper() {
		return helper;
	}

	public void setHelper(UdpSocketHelper helper) {
		this.helper = helper;
	}
}
