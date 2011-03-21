package com.shine.framework.DBUtil.manage;

import java.io.File;
import java.sql.Connection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.dom4j.Document;
import org.dom4j.Element;

import com.shine.framework.DBUtil.DBUtil;
import com.shine.framework.DBUtil.pool.DBPool;
import com.shine.framework.DBUtil.pool.NetDBPool;
import com.shine.framework.DBUtil.pool.SqliteDBPool;
import com.shine.framework.DBUtil.thread.MonitorThread;
import com.shine.framework.core.util.FileUtil;
import com.shine.framework.core.util.XmlUitl;

public class DBManager extends HashMap<String, DBPool> {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private static DBManager manager = new DBManager();
	private String xmlfile;
	private Map<String, DBPool> map = null;
	// 缓存模块
	private String cache = "false";
	private int cacheTime = 1800;
	private String cachePath = "cache";
	private MonitorThread monitorThread;
	private String jdbcCache = "jdbc/cache";

	public final static DBManager getInstance() {
		return manager;
	}

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
			Document document = XmlUitl.getFileDocument(xmlfile);
			Map<String, String> rootMap = XmlUitl.getAllAttribute(document
					.getRootElement());
			cache = rootMap.get("cache");
			cacheTime = Integer.parseInt(rootMap.get("cacheTime"));
			cachePath = rootMap.get("cachePath");
			rootMap = null;
			List<Element> list = XmlUitl.getAllElement(document
					.getRootElement(), "Resource");
			Map<String, String> attributeMap = null;
			for (Element element : list) {
				attributeMap = XmlUitl.getAllAttribute(element);
				if (!String.valueOf(attributeMap.get("driverClass")).equals(
						"org.sqlite.JDBC")) {
					DBPool pool = new NetDBPool();
					pool.init(String.valueOf(attributeMap.get("dbUserName")),
							String.valueOf(attributeMap.get("dbPassWord")),
							String.valueOf(attributeMap.get("jdbcUrl")), String
									.valueOf(attributeMap.get("driverClass")),
							Integer.parseInt(String.valueOf(attributeMap
									.get("initSize"))), Integer.parseInt(String
									.valueOf(attributeMap.get("minPoolSize"))),
							Integer.parseInt(String.valueOf(attributeMap
									.get("maxPoolSize"))), Integer
									.parseInt(String.valueOf(attributeMap
											.get("maxStatements"))), Integer
									.parseInt(String.valueOf(attributeMap
											.get("maxIdleTime"))));
					map.put(String.valueOf(attributeMap.get("jndi")), pool);
				} else {
					DBPool pool = new SqliteDBPool();
					pool.init("", "", String.valueOf(attributeMap
							.get("jdbcUrl")), String.valueOf(attributeMap
							.get("driverClass")));
					map.put(String.valueOf(attributeMap.get("jndi")), pool);
				}
			}
			startCacheFramework();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * 启动缓存模块
	 */
	public void startCacheFramework() {
		if (monitorThread != null) {
			return;
		}

		if (cache.equals("true")) {
			initCacheNewJndi(cachePath);
			DBUtil
					.getInstance()
					.executeUpdate(
							jdbcCache,
							"create table cache(sql varchar(20000),jndi varchar(50), result varchar(60000),time varchar(20));");
			monitorThread = new MonitorThread();
			monitorThread.setMonitorState(true);
			monitorThread.setCacheTime(this.cacheTime);
			monitorThread.start();

			System.out.println("缓存模块启动完成!");
		}
	}

	/**
	 * 启动缓存模块
	 * 
	 * @param cache
	 * @param cacheTime
	 * @param cachePath
	 */
	public void startCacheFramework(String cache, int cacheTime,
			String cachePath) {
		this.cache = cache;
		this.cacheTime = cacheTime;
		this.cachePath = cachePath;
		startCacheFramework();
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

	/**
	 * 初始化新的缓存库
	 * 
	 * @param dbPath
	 */
	public void initCacheNewJndi(String dbPath) {
		if (!FileUtil.checkFolder(System.getProperty("user.dir")
				+ File.separator + dbPath)) {
			FileUtil.createFolder(System.getProperty("user.dir")
					+ File.separator + dbPath);
		}

		if (FileUtil.checkFile(System.getProperty("user.dir") + File.separator
				+ dbPath + File.separator + "cache.db")) {
			FileUtil.deleteFile(System.getProperty("user.dir") + File.separator
					+ dbPath + File.separator + "cache.db");
		}

		StringBuffer jdbcUrl = new StringBuffer();
		jdbcUrl.append("jdbc:sqlite:");
		jdbcUrl.append(System.getProperty("user.dir") + File.separator);
		jdbcUrl.append(dbPath);
		jdbcUrl.append(File.separator);
		jdbcUrl.append("cache.db");
		initSqliteJndi(jdbcCache, jdbcUrl.toString());
	}

	/**
	 * 初始化sqlite连接池通过数据库路径
	 * 
	 * @param jndi
	 * @param dbPath
	 */
	public void initSqliteJndiByDBName(String jndi, String dbPath) {
		StringBuffer jdbcUrl = new StringBuffer();
		jdbcUrl.append("jdbc:sqlite:");
		jdbcUrl.append(dbPath);
		initSqliteJndi(jndi, jdbcUrl.toString());
	}

	/**
	 * 初始sqlite数据库
	 * 
	 * @param jndi
	 * @param jdbcUrl
	 */
	public void initSqliteJndi(String jndi, String jdbcUrl) {
		if (map == null)
			map = new HashMap<String, DBPool>();
		String driverClass = "org.sqlite.JDBC";
		DBPool pool = new SqliteDBPool();
		pool.init("", "", jdbcUrl.toString(), driverClass);
		map.put(jndi, pool);
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
		DBPool pool = new NetDBPool();
		pool.init(dbUserName, dbPassWord, jdbcUrl, driverClass, initSize,
				minPoolSize, maxPoolSize, maxStatements, maxIdleTime);
		map.put(jndi, pool);
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

	public String getXmlfile() {
		return xmlfile;
	}

	public void setXmlfile(String xmlfile) {
		this.xmlfile = xmlfile;
	}

	public Map<String, DBPool> getMap() {
		return map;
	}

	public void setMap(Map<String, DBPool> map) {
		this.map = map;
	}

	public String getCache() {
		return cache;
	}

	public void setCache(String cache) {
		this.cache = cache;
	}

	public int getCacheTime() {
		return cacheTime;
	}

	public void setCacheTime(int cacheTime) {
		this.cacheTime = cacheTime;
	}
}
