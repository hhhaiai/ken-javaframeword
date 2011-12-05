package com.shine.framework.core.util;

import java.util.List;

public abstract class SnmpAbstract {

	protected boolean state = false;
	protected int version = 0;
	protected String ip;
	protected int port;
	protected String implementClass;
	
	/**
	 * 初始化
	 * 
	 * @param ip
	 * @param community
	 * @param port
	 * @throws Exception
	 */
	public abstract void init(String ip, String community, int port,int v)
			throws Exception;

	/**
	 * 初始化
	 * 
	 * @param ip
	 * @param community
	 * @throws Exception
	 */
	public abstract void init(String ip, String community) throws Exception;

	/**
	 * 获取value
	 * 
	 * @param oid
	 * @return
	 */
	public abstract String getOidValueString(String oid);

	/**
	 * 获取value
	 * @param oid
	 * @param v
	 * @return
	 */
	public abstract String getOidValueString(String oid,int v);
	
	/**
	 * 获取table
	 * 
	 * @param oid
	 * @return
	 */
	public abstract List<String> getTableView(String oid);

	/**
	 * 获取table
	 * 
	 * @param oid
	 * @return
	 */
	public abstract List<String> getTableView(String oid[]);

	/**
	 * 重新连接
	 * 
	 * @param ip
	 * @param community
	 * @param port
	 */
	public abstract void reconnection(String ip, String community, int port);

	/**
	 * 重新连接
	 */
	public abstract void reconnection();

	public abstract void close();
	
	public int getVersion() {
		return version;
	}

	public void setVersion(int version) {
		this.version = version;
	}

	//Thread State
	public boolean isState() {
		return state;
	}

	public void setState(boolean state) {
		this.state = state;
	}
	public String getIp() {
		return ip;
	}

	public void setIp(String ip) {
		this.ip = ip;
	}

	public int getPort() {
		return port;
	}

	public void setPort(int port) {
		this.port = port;
	}

	public String getImplementClass() {
		return implementClass;
	}

	public void setImplementClass(String implementClass) {
		this.implementClass = implementClass;
	}	
}
