package com.shine.framework.SnmpUtil;

import java.net.InetAddress;
import java.util.ArrayList;
import java.util.List;

import snmp.SNMPObject;
import snmp.SNMPSequence;
import snmp.SNMPVarBindList;
import snmp.SNMPv1CommunicationInterface;

/**
 * snmp utilities
 * 
 * @author viruscodecn@gmail.com
 * @project JavaFramework 2.0 2010-11-29
 */
public class SnmpUtil {
	private SNMPv1CommunicationInterface comInterface = null;
	private String ip;
	private String community;
	private int port = 161;
	private int version = 0;

	/**
	 * 初始化
	 * 
	 * @param ip
	 * @param community
	 * @param port
	 * @throws Exception
	 */
	public SnmpUtil(String ip, String community, int port) throws Exception {
		InetAddress hostAddress = InetAddress.getByName(ip);
		comInterface = new SNMPv1CommunicationInterface(version, hostAddress,
				community, port);
	}

	/**
	 * 初始化
	 * 
	 * @param ip
	 * @param community
	 * @throws Exception
	 */
	public SnmpUtil(String ip, String community) throws Exception {
		InetAddress hostAddress = InetAddress.getByName(ip);
		comInterface = new SNMPv1CommunicationInterface(version, hostAddress,
				community);

	}

	/**
	 * 获取value
	 * 
	 * @param oid
	 * @return
	 */
	public String getOidValueString(String oid) {
		if (comInterface == null) {
			System.out.println("Snmp初始化出错");
			return null;
		}
		try {
			SNMPVarBindList newVars = comInterface.getMIBEntry(oid);
			SNMPSequence pair = (SNMPSequence) (newVars.getSNMPObjectAt(0));
			SNMPObject snmpValue = pair.getSNMPObjectAt(1);
			return snmpValue.toString();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	/**
	 * 获取table
	 * 
	 * @param oid
	 * @return
	 */
	public List<String> getTableView(String oid) {
		if (comInterface == null) {
			System.out.println("Snmp初始化出错");
			return null;
		}
		try {
			List<String> list = new ArrayList<String>();
			SNMPVarBindList tableVars = comInterface.retrieveMIBTable(oid);

			for (int i = 0; i < tableVars.size(); i++) {
				SNMPSequence pair = (SNMPSequence) (tableVars
						.getSNMPObjectAt(i));
				SNMPObject snmpValue = pair.getSNMPObjectAt(1);
				list.add(snmpValue.toString());
			}
			return list;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	/**
	 * 获取table
	 * 
	 * @param oid
	 * @return
	 */
	public List<String> getTableView(String oid[]) {
		if (comInterface == null) {
			System.out.println("Snmp初始化出错");
			return null;
		}
		try {
			List<String> list = new ArrayList<String>();
			SNMPVarBindList tableVars = comInterface.retrieveMIBTable(oid);

			for (int i = 0; i < tableVars.size(); i++) {
				SNMPSequence pair = (SNMPSequence) (tableVars
						.getSNMPObjectAt(i));
				SNMPObject snmpValue = pair.getSNMPObjectAt(1);
				list.add(snmpValue.toString());
			}
			return list;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	/**
	 * 重新连接
	 * 
	 * @param ip
	 * @param community
	 * @param port
	 */
	public void reconnection(String ip, String community, int port) {
		try {
			if (comInterface != null)
				comInterface.closeConnection();

			InetAddress hostAddress = InetAddress.getByName(ip);
			comInterface = new SNMPv1CommunicationInterface(version,
					hostAddress, community, port);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * 重新连接
	 */
	public void reconnection() {
		try {
			if (comInterface != null)
				comInterface.closeConnection();

			InetAddress hostAddress = InetAddress.getByName(ip);
			comInterface = new SNMPv1CommunicationInterface(version,
					hostAddress, community, port);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * 关闭
	 */
	public void close() {
		try {
			if (comInterface != null)
				comInterface.closeConnection();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
