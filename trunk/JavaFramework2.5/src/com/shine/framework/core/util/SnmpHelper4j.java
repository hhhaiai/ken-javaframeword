package com.shine.framework.core.util;

import java.util.List;
import java.util.Map;
import java.util.Vector;

import org.dom4j.Element;
import org.snmp4j.AbstractTarget;
import org.snmp4j.CommunityTarget;
import org.snmp4j.PDU;
import org.snmp4j.ScopedPDU;
import org.snmp4j.Snmp;
import org.snmp4j.TransportMapping;
import org.snmp4j.UserTarget;
import org.snmp4j.event.ResponseEvent;
import org.snmp4j.mp.MPv3;
import org.snmp4j.mp.SnmpConstants;
import org.snmp4j.security.AuthMD5;
import org.snmp4j.security.PrivDES;
import org.snmp4j.security.SecurityLevel;
import org.snmp4j.security.SecurityModels;
import org.snmp4j.security.SecurityProtocols;
import org.snmp4j.security.USM;
import org.snmp4j.security.UsmUser;
import org.snmp4j.smi.Address;
import org.snmp4j.smi.GenericAddress;
import org.snmp4j.smi.OID;
import org.snmp4j.smi.OctetString;
import org.snmp4j.smi.VariableBinding;
import org.snmp4j.transport.DefaultUdpTransportMapping;

public class SnmpHelper4j extends SnmpAbstract {

	// Snmp Instance
	private Snmp snmp = null;

	private String ip;

	// Unit(共同体)
	private String community = "public";

	// Default Port
	private int port = 161;

	// Snmp version
	private int version = 0;

	// Transport mapping
	private TransportMapping tm;

	private Address targetAddress;

	// Snmp Defualt Use UDP Protocl
	private String protol = "udp";

	public SnmpHelper4j() {

	}

	public SnmpHelper4j(String ip, String community) throws Exception {
		this.init(ip, community);
	}

	public SnmpHelper4j(String ip, String community, int port, int v)
			throws Exception {
		this.init(ip, community, port, v);
	}

	/**
	 * 初始化
	 */
	@Override
	public void init(String ip, String community, int port, int v)
			throws Exception {
		this.port = port;
		this.version = v;
		this.init(ip, community);
	}

	/**
	 * 初始化
	 */
	@Override
	public void init(String ip, String community) throws Exception {
		this.ip = ip;
		this.community = community;
		StringBuffer tstr = new StringBuffer(this.protol).append(":")
				.append(ip).append("/").append(this.port);
		this.targetAddress = GenericAddress.parse(tstr.toString());
		this.tm = new DefaultUdpTransportMapping();
		this.snmp = new Snmp(this.tm);
	}

	/**
	 * OID值
	 */
	@Override
	public String getOidValueString(String oid) {
		for (int i = 0; i <= 3; i++) {
			return this.getOidValueString(oid, i);
		}
		return null;
	}

	/**
	 * 存在预设值
	 * 
	 * @param oid
	 * @param v
	 * @return
	 */
	public String getOidValueString(String oid, int v) {
		if (v == 0 || v == 1) {
			String result = getSnmpV1OidValueString(oid, v);
			if (result != null) {
				return result;
			}
		}
		if (v == 3) {
			String result = getSnmpV3OidValueString(oid);
			if (result != null) {
				return result;
			}
		}
		return null;
	}

	/**
	 * 获取SnmpV1/V2版本OID值
	 * 
	 * @param oid
	 * @param snmpv
	 * @return
	 */
	private String getSnmpV1OidValueString(String oid, int snmpv) {
		this.state = true;
		CommunityTarget target = this.setCommunityTarget(snmpv);
		PDU pdu = this.setPdu(oid);
		try {
			return getStrResponse(snmpv, pdu, target);
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			this.state = false;
			this.close();
			pdu = null;
			target = null;
		}
		return null;
	}

	/**
	 * Snmp V1/V2 Target
	 * 
	 * @param snmpv
	 * @return
	 */
	private CommunityTarget setCommunityTarget(int snmpv) {
		CommunityTarget target = new CommunityTarget();
		target.setCommunity(new OctetString(this.community));
		target.setAddress(this.targetAddress);
		target.setVersion(snmpv);
		target.setTimeout(100);
		target.setRetries(1);
		return target;
	}

	/**
	 * SnmpV1/v2版本PDU数据
	 * 
	 * @param oid
	 * @return
	 */
	private PDU setPdu(String oid) {
		PDU pdu = new PDU();
		pdu.add(new VariableBinding(new OID(oid)));
		pdu.setType(PDU.GET);
		return pdu;
	}

	/**
	 * 获取SnmpV3版本OID值
	 * 
	 * @param oid
	 * @param snmpv
	 * @return
	 */
	private String getSnmpV3OidValueString(String oid) {
		this.state = true;
		USM usm = new USM(SecurityProtocols.getInstance(), new OctetString(MPv3
				.createLocalEngineID()), 0);
		SecurityModels.getInstance().addSecurityModel(usm);
		ScopedPDU spdu = this.setScopedPDU(oid);
		UserTarget target = this.setUserTarget();
		this.snmp.getUSM().addUser(
				new OctetString("MD5DES"),
				new UsmUser(new OctetString("MD5DES"), AuthMD5.ID,
						new OctetString("MD5DESUserAuthPassword"), PrivDES.ID,
						new OctetString("MD5DESUserPrivPassword")));
		try {
			return getStrResponse(3, spdu, target);
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			this.state = false;
			this.close();
			target = null;
			spdu = null;
			usm = null;
		}
		return null;
	}

	/**
	 * V3 Target
	 * 
	 * @return
	 */
	private UserTarget setUserTarget() {
		UserTarget target = new UserTarget();
		target.setAddress(this.targetAddress);
		target.setRetries(1);
		target.setTimeout(500);
		target.setVersion(SnmpConstants.version3);
		target.setSecurityLevel(SecurityLevel.AUTH_PRIV);
		target.setSecurityName(new OctetString("MD5DES"));
		return target;
	}

	/**
	 * SnmpV3版本Pdu数据
	 * 
	 * @param oid
	 * @return
	 */
	private ScopedPDU setScopedPDU(String oid) {
		ScopedPDU spdu = new ScopedPDU();
		spdu.add(new VariableBinding(new OID(oid)));
		spdu.setType(ScopedPDU.GET);
		spdu.setMaxRepetitions(50);
		return spdu;
	}

	/**
	 * OID字符串数据响应
	 * 
	 * @param snmpv
	 * @param pdu
	 * @param target
	 * @return
	 * @throws Exception
	 */
	private String getStrResponse(int snmpv, PDU pdu, AbstractTarget target)
			throws Exception {
		this.snmp.listen();
		ResponseEvent response = this.snmp.send(pdu, target);
		PDU tpdu = response.getResponse();
		if (response.getResponse() != null
				&& tpdu.getErrorIndex() == tpdu.noError
				&& tpdu.getErrorStatus() == tpdu.noError) {
			this.version = snmpv;
			Vector<VariableBinding> v = response.getResponse()
					.getVariableBindings();
			for (VariableBinding var : v) {
				return var.getOid().toString() + "(IP: " + this.ip + ":Snmp4j"
						+ ":snmpv" + (this.version + 1) + ")";
			}

		}
		return null;
	}

	@Override
	public List<String> getTableView(String oid) {

		return null;
	}

	@Override
	public List<String> getTableView(String[] oid) {

		return null;
	}

	/**
	 * 重连接
	 */
	@Override
	public void reconnection(String ip, String community, int port) {
		try {
			if (this.tm != null)
				this.tm.close();
			this.community = community;
			StringBuffer tstr = new StringBuffer(this.protol).append(":")
					.append(ip).append("/").append(port);
			this.targetAddress = GenericAddress.parse(tstr.toString());
			this.tm = new DefaultUdpTransportMapping();
			this.snmp = new Snmp(this.tm);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * 重连接
	 */
	@Override
	public void reconnection() {
		this.reconnection(this.ip, this.community, this.port);
	}

	/**
	 * 关闭监听
	 */
	@Override
	public void close() {
		try {
			if (this.tm != null) {
				this.tm.close();
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public int getVersion() {
		return version;
	}

	public void setVersion(int version) {
		this.version = version;
	}

	public Snmp getSnmp() {
		return snmp;
	}

	public void setSnmp(Snmp snmp) {
		this.snmp = snmp;
	}

	public String getIp() {
		return ip;
	}

	public void setIp(String ip) {
		this.ip = ip;
	}

	public String getCommunity() {
		return community;
	}

	public void setCommunity(String community) {
		this.community = community;
	}

	public int getPort() {
		return port;
	}

	public void setPort(int port) {
		this.port = port;
	}

	public TransportMapping getTm() {
		return tm;
	}

	public void setTm(TransportMapping tm) {
		this.tm = tm;
	}

	public Address getTargetAddress() {
		return targetAddress;
	}

	public void setTargetAddress(Address targetAddress) {
		this.targetAddress = targetAddress;
	}

	public String getProtol() {
		return protol;
	}

	public void setProtol(String protol) {
		this.protol = protol;
	}
	/**
	 * @param args
	 */
	// public static void main(String[] args) throws Exception {
	// SnmpHelper4j sh = new SnmpHelper4j("192.168.2.18", "public", 161);
	// System.out.println(sh.getOidValueString("1.3.6.1.2.1.1.1.0"));
	// boolean is = sh.preProccess("192.168.2.19","snmp4j",0,160);
	// System.out.println(is);
	// }
}
