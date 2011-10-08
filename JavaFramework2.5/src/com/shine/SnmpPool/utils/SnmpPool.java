package com.shine.SnmpPool.utils;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.shine.framework.core.util.SnmpAbstract;

public class SnmpPool extends HashMap<String, List<SnmpAbstract>> {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * 加入snmp接收器
	 * 
	 * @param name
	 * @param snmpInterface
	 */
	public void addSnmp(String name, SnmpAbstract snmpAbstract) {
		if (snmpAbstract != null) {
			if (!this.containsKey(name)) {
				List<SnmpAbstract> list = new ArrayList<SnmpAbstract>();
				this.put(name, list);
			}
			this.get(name).add(snmpAbstract);
		}
	}

	/**
	 * 获取空闲的snmp连接器
	 * 
	 * @param name
	 */
	public SnmpAbstract getIdleSnmp(String name) {
		if (this.containsKey(name)) {
			List<SnmpAbstract> list = this.get(name);
			for (SnmpAbstract snmpAbstract : list) {
				if (!snmpAbstract.isState())
					return snmpAbstract;
			}
		}
		return null;
	}

	/**
	 * 关闭指定的snmp池
	 * 
	 * @param name
	 */
	public void close(String name) {
		if (this.containsKey(name)) {
			List<SnmpAbstract> list = this.get(name);
			for (SnmpAbstract snmpAbstract : list) {
				snmpAbstract.close();
			}
			this.remove(name);
		}
	}

	/**
	 * 关闭所有snmp池
	 */
	public void close() {
		for (String name : this.keySet()) {
			List<SnmpAbstract> list = this.get(name);
			for (SnmpAbstract snmpAbstract : list) {
				snmpAbstract.close();
			}
			this.remove(name);
		}
	}
}
