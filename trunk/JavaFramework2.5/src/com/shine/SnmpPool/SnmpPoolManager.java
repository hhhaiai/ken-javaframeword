package com.shine.SnmpPool;

import java.util.ArrayList;
import java.util.List;

import com.shine.SnmpPool.utils.SnmpPool;
import com.shine.framework.core.util.ReflectionUtil;
import com.shine.framework.core.util.SnmpAbstract;

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

	/**
	 * 加入snmp接收器
	 * 
	 * @param name
	 * @param ip
	 * @param community
	 * @param port
	 * @param poolSize
	 * @throws Exception
	 */
	public void addSnmp(String name, String ip, String community, int port,
			int poolSize) throws Exception {
		addSnmp(name, ip, community, port, poolSize,
				"com.shine.framework.core.util.SnmpHelper");
	}

	/**
	 * 初始化snmp采集器
	 * 
	 * @param name
	 * @param ip
	 * @param community
	 * @param port
	 * @param poolSize
	 * @param classPath
	 * @throws Exception
	 */
	public void addSnmp(String name, String ip, String community, int port,
			int poolSize, String classPath) throws Exception {
		try {
			for (int i = 0; i < poolSize; i++) {
				SnmpAbstract snmpAbstract = (SnmpAbstract) ReflectionUtil
						.getClasstoObject(classPath);
				snmpAbstract.init(ip, community, port);
				snmpPool.addSnmp(name, snmpAbstract);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * 获取指定的oid的value
	 * 
	 * @param name
	 * @param oid
	 * @return
	 */
	public String getOidValue(String name, String oid) {
		SnmpAbstract snmpAbstract = this.snmpPool.getIdleSnmp(name);
		return snmpAbstract.getOidValueString(oid);
	}

	/**
	 * 批量获取oid的value
	 * 
	 * @param name
	 * @param oid
	 * @return
	 */
	public List<String> getOidValue(String name, String oid[]) {
		SnmpAbstract snmpAbstract = this.snmpPool.getIdleSnmp(name);
		return snmpAbstract.getTableView(oid);
	}

	/**
	 * 获取值得oid的table view
	 * 
	 * @param name
	 * @param oid
	 * @return
	 */
	public List<String> getTableValue(String name, String oid) {
		SnmpAbstract snmpAbstract = this.snmpPool.getIdleSnmp(name);
		return snmpAbstract.getTableView(oid);
	}

	/**
	 * 批量获取值得oid的table view
	 * 
	 * @param name
	 * @param oid
	 * @return
	 */
	public List<String> getTableValue(String name, String oid[]) {
		SnmpAbstract snmpAbstract = this.snmpPool.getIdleSnmp(name);
		return snmpAbstract.getTableView(oid);
	}

	public SnmpPool getSnmpPool() {
		return snmpPool;
	}

	public void setSnmpPool(SnmpPool snmpPool) {
		this.snmpPool = snmpPool;
	}

	/**
	 * 获取空闲snmp连接器
	 * 
	 * @param name
	 * @return
	 */
	public SnmpAbstract getIdleSnmp(String name) {
		return this.snmpPool.getIdleSnmp(name);
	}

	/**
	 * 关闭指定的snmp池
	 * 
	 * @param name
	 */
	public void close(String name) {
		this.snmpPool.close(name);
	}

	/**
	 * 关闭所有snmp池
	 */
	public void close() {
		this.snmpPool.close();
	}
}
