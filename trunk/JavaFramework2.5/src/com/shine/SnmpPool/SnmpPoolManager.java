package com.shine.SnmpPool;

import com.shine.SnmpPool.utils.SnmpPool;

/**
 * snmp采集池的管理器
 * 
 * @author viruscodecn@gmail.com
 * 
 */
public class SnmpPoolManager {
	private static SnmpPoolManager manager = null;

	private SnmpPool snmpPool = new SnmpPool();

	public static SnmpPoolManager getManager() {
		if (manager == null)
			manager = new SnmpPoolManager();
		return manager;
	}

	public String getOidValue(String name, String oid) {
		return null;
	}

	public SnmpPool getSnmpPool() {
		return snmpPool;
	}

	public void setSnmpPool(SnmpPool snmpPool) {
		this.snmpPool = snmpPool;
	}

}
