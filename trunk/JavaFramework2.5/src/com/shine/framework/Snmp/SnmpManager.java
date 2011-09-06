package com.shine.framework.Snmp;

public class SnmpManager {
	private static SnmpManager manager = null;

	public static SnmpManager getManager() {
		if (manager == null)
			manager = new SnmpManager();
		return manager;
	}
	
	
}
