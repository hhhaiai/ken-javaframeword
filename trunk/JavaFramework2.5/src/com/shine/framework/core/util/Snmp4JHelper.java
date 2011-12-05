package com.shine.framework.core.util;

import java.io.IOException;
import java.util.List;
import java.util.Vector;

import org.apache.log4j.Logger;
import org.snmp4j.CommunityTarget;
import org.snmp4j.PDU;
import org.snmp4j.Snmp;
import org.snmp4j.TransportMapping;
import org.snmp4j.event.ResponseEvent;
import org.snmp4j.mp.SnmpConstants;
import org.snmp4j.smi.Counter32;
import org.snmp4j.smi.Gauge32;
import org.snmp4j.smi.GenericAddress;
import org.snmp4j.smi.Integer32;
import org.snmp4j.smi.OID;
import org.snmp4j.smi.OctetString;
import org.snmp4j.smi.VariableBinding;
import org.snmp4j.transport.DefaultUdpTransportMapping;

public class Snmp4JHelper extends SnmpAbstract {
	private int port;
	protected Snmp snmp;
	private TransportMapping transport;
	protected CommunityTarget target;
	protected static final int RETRIES = 2;
	protected static final int DEFAULT_TIMEOUT = 8000;
	protected int timeOut = DEFAULT_TIMEOUT;

	public Snmp4JHelper() {

	}

	public Snmp4JHelper(String ip, String community, int port,int v) throws Exception {
		init(ip, community, port,v);
	}

	public Snmp4JHelper(String ip, String community) throws Exception {
		init(ip, community);
	}

	@Override
	public void init(String ip, String community, int port,int v) throws Exception {
		try {
			transport = new DefaultUdpTransportMapping();
			snmp = new Snmp(transport);
			snmp.listen();
		} catch (IOException ioe) {
			close();
			Logger.getLogger(Snmp4JHelper.class).error(ioe);
		}
		this.port = port;
		createTarget(ip, community);

	}

	@Override
	public void init(String ip, String community) throws Exception {
		try {
			transport = new DefaultUdpTransportMapping();
			snmp = new Snmp(transport);
			snmp.listen();
		} catch (IOException ioe) {
			close();
			Logger.getLogger(Snmp4JHelper.class).error(ioe);
		}
		this.port = 161;
		createTarget(ip, community);

	}

	@Override
	public void close() {
		try {
			transport.close();
			snmp.close();
		} catch (Exception e) {
		}
	}

	@Override
	public String getOidValueString(String oid) {
		try {
			PDU pdu = new PDU();
			pdu.add(new VariableBinding(new OID(oid)));
			pdu.setType(PDU.GET);
			ResponseEvent response = snmp.send(pdu, target);
			if (response.getResponse() != null) {
				Vector responseContent = response.getResponse()
						.getVariableBindings();
				VariableBinding vb = (VariableBinding) responseContent
						.elementAt(0);
				if (vb.getVariable() instanceof Gauge32)
					return String.valueOf(((Gauge32) vb.getVariable())
							.getValue()); // long
				else if (vb.getVariable() instanceof Counter32)
					return String.valueOf(((Counter32) vb.getVariable())
							.getValue()); // long
				else if (vb.getVariable() instanceof Integer32)
					return String.valueOf(((Integer32) vb.getVariable())
							.getValue()); // int
				else
					return vb.getVariable().toString(); // string
			}
		} catch (Exception e) {
		}
		return null;
	}

	@Override
	public List<String> getTableView(String oid) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<String> getTableView(String[] oid) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void reconnection(String ip, String community, int port) {
		// TODO Auto-generated method stub

	}

	@Override
	public void reconnection() {
		// TODO Auto-generated method stub

	}

	protected void createTarget(String ipAddress, String community) {
		if (ipAddress != null && community != null) {
			target = new CommunityTarget();
			target.setCommunity(new OctetString(community));
			target.setRetries(RETRIES);
			target.setAddress(GenericAddress.parse("udp:" + ipAddress + "/"
					+ port));
			target.setTimeout(timeOut);
			target.setVersion(SnmpConstants.version2c);
		}
	}

	@Override
	public String getOidValueString(String oid, int v) {
		// TODO Auto-generated method stub
		return null;
	}

}
