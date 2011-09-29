package com.shine.framework.core.util;

import java.net.InetAddress;
import java.util.ArrayList;
import java.util.List;

import com.shine.framework.core.interfaces.SnmpInterface;

import snmp.SNMPObject;
import snmp.SNMPSequence;
import snmp.SNMPVarBindList;
import snmp.SNMPv1CommunicationInterface;

public class SnmpHelper implements SnmpInterface {
	private SNMPv1CommunicationInterface comInterface = null;
	private String ip;
	private String community;
	private int port = 161;
	private int version = 0;

	
	public SnmpHelper(String ip, String community, int port) throws Exception {
		init(ip, community, port);
	}

	
	public SnmpHelper(String ip, String community) throws Exception {
		init(ip, community);
	}

	@Override
	public void init(String ip, String community, int port) throws Exception {
		InetAddress hostAddress = InetAddress.getByName(ip);
		comInterface = new SNMPv1CommunicationInterface(version, hostAddress,
				community, port);
	}

	@Override
	public void init(String ip, String community) throws Exception {
		InetAddress hostAddress = InetAddress.getByName(ip);
		comInterface = new SNMPv1CommunicationInterface(version, hostAddress,
				community);
	}

	
	@Override
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

	
	@Override
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

	
	@Override
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

	
	@Override
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

	
	@Override
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

	
	@Override
	public void close() {
		try {
			if (comInterface != null)
				comInterface.closeConnection();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		SnmpHelper util = null;
		try {
			String[] oid = { "1.3.6.1.4.1.311.1.7.2.1.1" };
			util = new SnmpHelper("192.168.2.18", "public", 161);
			List<String> list = util.getTableView(oid);
			for (String s : list) {
				System.out.println(s);
			}
			util.close();
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			util.close();
		}
	}
}
