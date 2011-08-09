package com.shine.DBUtil.manage;

import java.io.File;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.dom4j.Document;
import org.dom4j.Element;

import com.shine.DBUtil.DBUtil;
import com.shine.DBUtil.pool.DBPool;
import com.shine.DBUtil.pool.NetDBPool;
import com.shine.DBUtil.pool.SqliteDBPool;
import com.shine.DBUtil.thread.MonitorThread;
import com.shine.DBUtil.utils.ClusterList;
import com.shine.framework.core.util.FileUtil;
import com.shine.framework.core.util.XmlUitl;

public class DBManager extends HashMap<String, DBPool> {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private static DBManager manager = null;
	private String xmlfile;
	// 线程池容器
	private Map<String, DBPool> map = null;
	// 集群容器
	private Map<String, ClusterList> clusterMap = null;
	// 缓存模块
	private String cache = "false";
	private int cacheTime = 1800;
	private String cachePath = "cache";
	private MonitorThread monitorThread;
	private String jdbcCache = "jdbc/cache";

	public final static DBManager getInstance() {
		if (manager == null)
			manager = new DBManager();
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
		if (clusterMap == null)
			clusterMap = new HashMap<String, ClusterList>();

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

				if (String.valueOf(attributeMap.get("driverClass")).equals(
						"org.sqlite.JDBC")
						|| String.valueOf(attributeMap.get("driverClass"))
								.equals("org.relique.jdbc.csv.CsvDriver")) {
					// 初始化sqllite数据库
					DBPool pool = new SqliteDBPool();
					pool.init("", "", String.valueOf(attributeMap
							.get("jdbcUrl")), String.valueOf(attributeMap
							.get("driverClass")));
					map.put(String.valueOf(attributeMap.get("jndi")), pool);
				} else {
					// 初始化连接池
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
				}
			}
			list = null;

			// 加载集群
			List<Element> clusterList = XmlUitl.getAllElement(document
					.getRootElement(), "Cluster");
			for (Element element : clusterList) {
				List<Element> resourceList = XmlUitl.getAllElement(element,
						"Resource");
				ClusterList resourceNameList = new ClusterList();
				for (Element ele : resourceList) {
					Map attributeMap1 = XmlUitl.getAllAttribute(ele);
					resourceNameList.add(String.valueOf(attributeMap1
							.get("jndi")));
					attributeMap1 = null;
				}
				resourceList = null;

				attributeMap = XmlUitl.getAllAttribute(element);
				// 设置主要数据库
				resourceNameList.setMainDB(attributeMap.get("mainDB"));
				clusterMap.put(attributeMap.get("jndiCluster"),
						resourceNameList);
				attributeMap = null;
			}

			// 启动缓存模块
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

			System.out.println("缓存模块启动完成!!!!");
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
	 * 获取集群的连接器
	 * 
	 * @param clusterJndi
	 * @return
	 */
	public final Connection getClusterConnection(String clusterJndi) {
		try {
			ClusterList clusterList = clusterMap.get(clusterJndi);
			// 检查主连接数据库是否正常
			if (this.testCheckoutConnection(clusterList.getMainDB()))
				return null;

			String idleJndiName = null;
			int idleJndiNum = 999;
			for (String clusterJndiName : clusterList) {
				if (this.getNumBusyConnection(clusterJndiName) == 0) {
					idleJndiName = clusterJndiName;
					continue;
				}

				if (this.testCheckoutConnection(clusterJndiName)
						&& idleJndiNum > this
								.getNumBusyConnection(clusterJndiName)) {
					idleJndiNum = this.getNumBusyConnection(clusterJndiName);
					idleJndiName = clusterJndiName;
				}
			}
			clusterList = null;
			// 输出集群查询的数据库jndi
			System.out.println("集群查询的数据库" + idleJndiName);
			return map.get(idleJndiName).getConnection();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	/**
	 * 获取集群数据库连接器列表
	 * 
	 * @param clusterJndi
	 * @return
	 */
	public final List<Connection> getClusterConnectionList(String clusterJndi) {
		List<Connection> list = null;
		try {
			list = new ArrayList<Connection>();
			ClusterList clusterList = clusterMap.get(clusterJndi);
			for (String clusterJndiName : clusterList) {
				list.add(map.get(clusterJndiName).getConnection());
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return list;
	}

	/**
	 * 获取集群数据库jndi列表
	 * 
	 * @param clusterJndi
	 * @return
	 */
	public final ClusterList getClusterConnectionNameList(String clusterJndi) {
		ClusterList list = null;
		try {
			list = clusterMap.get(clusterJndi);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return list;
	}

	/**
	 * 获取连接池连接总数
	 * 
	 * @param jndi
	 * @return
	 * @throws SQLException
	 */
	public int getNumConnection(String jndi) throws SQLException {
		return map.get(jndi).getNumConnection();
	}

	/**
	 * 获取连接池空闲连接数
	 * 
	 * @param jndi
	 * @return
	 * @throws SQLException
	 */
	public int getNumIdleConection(String jndi) throws SQLException {
		return map.get(jndi).getNumIdleConection();
	}

	/**
	 * 获取连接池繁忙连接数
	 * 
	 * @param jndi
	 * @return
	 * @throws SQLException
	 */
	public int getNumBusyConnection(String jndi) throws SQLException {
		return map.get(jndi).getNumBusyConnection();
	}

	/**
	 * 检查该连接池是否正常
	 * 
	 * @param jndi
	 * @return
	 * @throws SQLException
	 */
	public boolean testCheckoutConnection(String jndi) throws SQLException {
		return map.get(jndi).testCheckoutConnection();
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
