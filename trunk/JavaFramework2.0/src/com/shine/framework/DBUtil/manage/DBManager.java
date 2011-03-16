package com.shine.framework.DBUtil.manage;

import java.sql.Connection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.dom4j.Document;
import org.dom4j.Element;

import com.shine.framework.DBUtil.pool.DBPool;
import com.shine.framework.core.util.XmlUitl;

public class DBManager extends HashMap<String, DBPool> {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private static DBManager manager = new DBManager();
	private Document document;
	private String xmlfile;
	private Map<String, DBPool> map = null;

	/**
	 * 初始化
	 * 
	 * @param xmlfile
	 */
	public void init(String xmlfile) {
		if (map == null)
			map = new HashMap<String, DBPool>();
		try {
			this.xmlfile = xmlfile;
			document = XmlUitl.getFileDocument(xmlfile);
			List<Element> list = XmlUitl.getAllElement(document
					.getRootElement(), "Resource");
			Map attributeMap = null;
			for (Element element : list) {
				attributeMap = XmlUitl.getAllAttribute(element);
				DBPool pool = new DBPool();
				pool.init(String.valueOf(attributeMap.get("dbUserName")),
						String.valueOf(attributeMap.get("dbPassWord")), String
								.valueOf(attributeMap.get("jdbcUrl")), String
								.valueOf(attributeMap.get("driverClass")),
						Integer.parseInt(String.valueOf(attributeMap
								.get("initSize"))), Integer.parseInt(String
								.valueOf(attributeMap.get("minPoolSize"))),
						Integer.parseInt(String.valueOf(attributeMap
								.get("maxPoolSize"))), Integer.parseInt(String
								.valueOf(attributeMap.get("maxStatements"))),
						Integer.parseInt(String.valueOf(attributeMap
								.get("maxIdleTime"))));
				map.put(String.valueOf(attributeMap.get("jndi")), pool);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * 初始化mysql jndi连接池
	 * 
	 * @param jndi
	 * @param ip
	 * @param port
	 * @param dbUserName
	 * @param dbPassWord
	 */
	public void initMysqlJndi(String jndi, String ip, String port,
			String dbName, String dbUserName, String dbPassWord) {
		String driverClass = "com.mysql.jdbc.Driver";
		StringBuffer jdbcUrl = new StringBuffer();
		jdbcUrl.append("jdbc:mysql://");
		jdbcUrl.append(ip);
		jdbcUrl.append(":");
		jdbcUrl.append(port);
		jdbcUrl.append("/");
		jdbcUrl.append(dbName);
		jdbcUrl.append("?useUnicode=true&amp;characterEncoding=utf-8");
		// 初始化连接池
		initNewJndi(jndi, dbUserName, dbPassWord, jdbcUrl.toString(),
				driverClass);
		jdbcUrl = null;
		driverClass = null;
	}

	public void initSqlliteJndi(String jndi, String dbPath) {
		String driverClass = "org.sqlite.JDBC";
		StringBuffer jdbcUrl = new StringBuffer();
		jdbcUrl.append("jdbc:sqlite:");
		jdbcUrl.append(dbPath);
		
	}

	/**
	 * 初始化新的jndi
	 * 
	 * @param jndi
	 * @param dbUserName
	 * @param dbPassWord
	 * @param jdbcUrl
	 * @param driverClass
	 */
	public void initNewJndi(String jndi, String dbUserName, String dbPassWord,
			String jdbcUrl, String driverClass) {
		initNewJndi(jndi, dbUserName, dbPassWord, jdbcUrl, driverClass, 2, 1,
				10, 50, 60);
	}

	/**
	 * 初始化新的jndi
	 * 
	 * @param jndi
	 * @param dbUserName
	 * @param dbPassWord
	 * @param jdbcUrl
	 * @param driverClass
	 * @param initSize
	 * @param minPoolSize
	 * @param maxPoolSize
	 * @param maxStatements
	 * @param maxIdleTime
	 */
	public void initNewJndi(String jndi, String dbUserName, String dbPassWord,
			String jdbcUrl, String driverClass, int initSize, int minPoolSize,
			int maxPoolSize, int maxStatements, int maxIdleTime) {
		if (map == null)
			map = new HashMap<String, DBPool>();
		DBPool pool = new DBPool();
		pool.init(dbUserName, dbPassWord, jdbcUrl, driverClass, initSize,
				minPoolSize, maxPoolSize, maxStatements, maxIdleTime);
		map.put(jndi, pool);
	}

	public final static DBManager getInstance() {
		return manager;
	}

	/**
	 * 获取默认数据库连接
	 * 
	 * @return
	 */
	public final Connection getConnection() {
		try {
			return getDefaultDBPool().getConnection();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	/**
	 * 获取指定数据库的连接
	 * 
	 * @param jndi
	 * @return
	 */
	public final Connection getConnection(String jndi) {
		try {
			return map.get(jndi).getConnection();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	/**
	 * 获取默认连接
	 * 
	 * @return
	 */
	private DBPool getDefaultDBPool() {
		Iterator it = map.keySet().iterator();
		while (it.hasNext()) {
			return map.get(it.next().toString());
		}
		return null;
	}
}
