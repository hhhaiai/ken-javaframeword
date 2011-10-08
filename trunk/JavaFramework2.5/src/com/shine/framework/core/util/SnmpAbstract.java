package com.shine.framework.core.util;

import java.util.List;

public abstract class SnmpAbstract {

	// 运行状态
	protected boolean state = false;

	public boolean isState() {
		return state;
	}

	public void setState(boolean state) {
		this.state = state;
	}

	/**
	 * 初始化
	 * 
	 * @param ip
	 * @param community
	 * @param port
	 * @throws Exception
	 */
	public abstract void init(String ip, String community, int port)
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
}
