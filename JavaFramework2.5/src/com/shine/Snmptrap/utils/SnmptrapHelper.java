package com.shine.Snmptrap.utils;

import java.io.IOException;
import java.net.UnknownHostException;
import java.util.Vector;

import org.snmp4j.CommandResponder;
import org.snmp4j.CommandResponderEvent;
import org.snmp4j.MessageDispatcherImpl;
import org.snmp4j.Snmp;
import org.snmp4j.TransportMapping;
import org.snmp4j.mp.MPv1;
import org.snmp4j.mp.MPv2c;
import org.snmp4j.mp.MPv3;
import org.snmp4j.security.SecurityModels;
import org.snmp4j.security.SecurityProtocols;
import org.snmp4j.security.USM;
import org.snmp4j.smi.Address;
import org.snmp4j.smi.GenericAddress;
import org.snmp4j.smi.OctetString;
import org.snmp4j.smi.TcpAddress;
import org.snmp4j.smi.UdpAddress;
import org.snmp4j.smi.VariableBinding;
import org.snmp4j.transport.DefaultTcpTransportMapping;
import org.snmp4j.transport.DefaultUdpTransportMapping;
import org.snmp4j.util.MultiThreadedMessageDispatcher;
import org.snmp4j.util.ThreadPool;

public class SnmptrapHelper implements CommandResponder {
	private MultiThreadedMessageDispatcher dispatcher;
	private Snmp snmp = null;
	private Address listenAddress;
	private ThreadPool threadPool;

	/**
	 * 初始化默认的
	 * 
	 * @throws UnknownHostException
	 * @throws IOException
	 */
	public void init() throws UnknownHostException, IOException {
		init("127.0.0.1", 162, 2);
	}

	/**
	 * 初始化接收器
	 * 
	 * @param ip
	 * @param port
	 * @param trapThreadSize
	 * @throws UnknownHostException
	 * @throws IOException
	 */
	public void init(String ip, int port, int trapThreadSize)
			throws UnknownHostException, IOException {
		threadPool = ThreadPool.create("Trap", trapThreadSize);
		dispatcher = new MultiThreadedMessageDispatcher(threadPool,
				new MessageDispatcherImpl());
		StringBuffer addressString = new StringBuffer();
		addressString.append("udp:");
		addressString.append(ip);
		addressString.append("/");
		addressString.append(port);
		listenAddress = GenericAddress.parse(System.getProperty(
				"snmp4j.listenAddress", addressString.toString())); // 本地IP与监听端口
		addressString = null;
		TransportMapping transport;
		// 对TCP与UDP协议进行处理
		if (listenAddress instanceof UdpAddress) {
			transport = new DefaultUdpTransportMapping(
					(UdpAddress) listenAddress);
		} else {
			transport = new DefaultTcpTransportMapping(
					(TcpAddress) listenAddress);
		}
		snmp = new Snmp(dispatcher, transport);
		snmp.getMessageDispatcher().addMessageProcessingModel(new MPv1());
		snmp.getMessageDispatcher().addMessageProcessingModel(new MPv2c());
		snmp.getMessageDispatcher().addMessageProcessingModel(new MPv3());
		USM usm = new USM(SecurityProtocols.getInstance(), new OctetString(MPv3
				.createLocalEngineID()), 0);
		SecurityModels.getInstance().addSecurityModel(usm);
	}

	/**
	 * 启动监听
	 * 
	 * @throws IOException
	 */
	public void start() throws IOException {
		if (snmp != null) {
			snmp.listen();
			snmp.addCommandResponder(this);
			System.out.println("开始监听Trap信息!");
		} else {
			System.err.println("启动监听Trap信息出错!");
		}
	}

	/**
	 * 停止监听
	 * 
	 * @throws IOException
	 */
	public void stop() throws IOException {
		if (snmp != null) {
			snmp.close();
		}
	}

	/**
	 * 实现CommandResponder的processPdu方法, 用于处理传入的请求、PDU等信息 当接收到trap时，会自动进入这个方法
	 * 
	 * @param respEvnt
	 */
	public void processPdu(CommandResponderEvent respEvnt) {
		// 解析Response
		if (respEvnt != null && respEvnt.getPDU() != null) {
			Vector<VariableBinding> recVBs = respEvnt.getPDU()
					.getVariableBindings();
			for (int i = 0; i < recVBs.size(); i++) {
				VariableBinding recVB = recVBs.elementAt(i);
				System.out
						.println(recVB.getOid() + " : " + recVB.getVariable());
			}
		}
	}

	public static void main(String args[]) throws UnknownHostException,
			IOException {
		SnmptrapHelper helper = new SnmptrapHelper();
		helper.init();
		helper.start();
	}
}
