package com.shine.framework.core.interfaces;

import java.util.List;

/**
 * snmp接口
 * @author viruscodecn@gmail.com
 *
 */
public interface SnmpInterface {
	/**
	 * 初始化
	 * 
	 * @param ip
	 * @param community
	 * @param port
	 * @throws Exception
	 */
	public void init(String ip, String community, int port)  throws Exception;

	/**
	 * 初始化
	 * 
	 * @param ip
	 * @param community
	 * @throws Exception
	 */
	public void init(String ip, String community)  throws Exception;

	/**
	 * 获取value
	 * 
	 * @param oid
	 * @return
	 */
	public String getOidValueString(String oid);

	/**
	 * 获取table
	 * 
	 * @param oid
	 * @return
	 */
	public List<String> getTableView(String oid);

	/**
	 * 获取table
	 * 
	 * @param oid
	 * @return
	 */
	public List<String> getTableView(String oid[]);

	/**
	 * 重新连接
	 * 
	 * @param ip
	 * @param community
	 * @param port
	 */
	public void reconnection(String ip, String community, int port);

	/**
	 * 重新连接
	 */
	public void reconnection();

	
	public void close();
}
