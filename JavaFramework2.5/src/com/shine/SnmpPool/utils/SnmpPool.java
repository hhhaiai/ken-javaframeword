package com.shine.SnmpPool.utils;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;
import com.shine.framework.core.util.SnmpAbstract;
public class SnmpPool extends HashMap<String, SnmpAbstract> {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * 加入SNMP采集器
	 * 
	 * @param name
	 * @param snmpInterface
	 */
	public void addSnmp(String name, SnmpAbstract snmpAbstract) {
		if (snmpAbstract != null) {
			if (!this.containsKey(name)) {
				this.put(name, snmpAbstract);
			}
		}
	}

	/**
	 * 获取空闲的SNMP采集器
	 * 
	 * @param name
	 */
	public SnmpAbstract getIdleSnmp(String name) {
		if (this.containsKey(name)) {
			SnmpAbstract snmpAbstract = this.get(name);
			if(!snmpAbstract.isState()){
				return snmpAbstract;				
			}
		}
		return null;
	}

	/**
	 * 关闭指定的SNMP池
	 * 
	 * @param name
	 */
	public void close(String name) {
		if (this.containsKey(name)) {
			SnmpAbstract snmpAbstract = this.get(name);
			snmpAbstract.close();
			this.remove(name);
		}
	}

	/**
	 * 关闭所有snmp池
	 */
	public void close() {
		Set<Map.Entry<String,SnmpAbstract>> set = this.entrySet();
		Iterator<Map.Entry<String,SnmpAbstract>> it = set.iterator();
        while(it.hasNext()){
        	Map.Entry<String,SnmpAbstract> e = it.next();
        	SnmpAbstract snmpAbstract = e.getValue();
        	snmpAbstract.close();
        	this.remove(e.getKey());
        }	
	}
}
