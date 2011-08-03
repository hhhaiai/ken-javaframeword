package com.shine.DBUtil;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.List;

import com.shine.DBUtil.manage.DBManager;
import com.shine.DBUtil.model.DBModel;
import com.shine.DBUtil.threadModel.SelectThreadModel;
import com.shine.DBUtil.threadModel.UpdateThreadModel;
import com.shine.DBUtil.utils.BatchMap;
import com.shine.framework.ThreadPoolUtil.ThreadPoolManager;

/**
 * db util java数据库操作类库
 * 
 * @author viruscodecn@gmail.com
 * @url 概述 http://blog.csdn.net/arjick/article/details/6656401
 * @url 配置连接和分页查询 http://blog.csdn.net/arjick/article/details/6656456
 * @url 多线程异步查询 http://blog.csdn.net/arjick/article/details/6656488
 * @url 缓冲多线程插入 http://blog.csdn.net/arjick/article/details/6656537
 */
public class DBUtil {

	private static DBUtil util = new DBUtil();
	// 缓存提交sql
	private int batchSqlSize = 500;
	private int batchThreadSize = 10;
	private BatchMap map = new BatchMap();
	// 异步查询线程数
	private int selectThreadSize = 10;
	// log File path
	private String filePath = "";
	private boolean logPolicy = false;

	public final static DBUtil getInstance() {
		return util;
	}

	/**
	 * 初始化
	 * 
	 * @param xmlfile
	 */
	public void init(String xmlfile) {
		DBManager.getInstance().init(xmlfile);
		initSelectThreadPool();
		initBatchThreadPool();
		ThreadPoolManager.getManager().startThreadPool();
	}

	/**
	 * 初始化查询线程
	 */
	public void initSelectThreadPool() {
		SelectThreadModel selectThreadModel = null;
		for (int i = 0; i < batchThreadSize; i++) {
			selectThreadModel = new SelectThreadModel();
			selectThreadModel.setThreadName("selectThreadModel" + i);
			ThreadPoolManager.getManager().addThread(selectThreadModel);
			selectThreadModel = null;
		}
	}

	/**
	 * 初始化批量提交线程池
	 */
	public void initBatchThreadPool() {
		UpdateThreadModel updateThreadModel = null;
		for (int i = 0; i < batchThreadSize; i++) {
			updateThreadModel = new UpdateThreadModel();
			updateThreadModel.setThreadName("updateThreadModel" + i);
			ThreadPoolManager.getManager().addThread(updateThreadModel);
			updateThreadModel = null;
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
		DBManager.getInstance().initMysqlJndi(jndi, ip, port, dbName,
				dbUserName, dbPassWord);
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
		DBManager.getInstance().initNewJndi(jndi, dbUserName, dbPassWord,
				jdbcUrl, driverClass);
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
			int maxPoolSize, int maxStatements, int maxIdleTime,
			int batchSqlSize) {
		DBManager.getInstance().initNewJndi(jndi, dbUserName, dbPassWord,
				jdbcUrl, driverClass, initSize, minPoolSize, maxPoolSize,
				maxStatements, maxIdleTime);
		this.setBatchSqlSize(batchSqlSize);
	}

	/**
	 * 查询数据
	 * 
	 * @param conn
	 * @param sql
	 * @return
	 */
	public DBModel executeQuery(Connection conn, String sql) {
		DBModel dbModel = new DBModel();
		Statement stat = null;
		ResultSet rs = null;
		try {
			stat = conn.createStatement();
			rs = stat.executeQuery(sql);
			dbModel.setResultSet(conn, stat, rs);
		} catch (Exception e) {
			e.printStackTrace();
			System.err.println("执行失败sql:" + sql);
		}
		return dbModel;
	}

	/**
	 * 查询数据
	 * 
	 * @param jndi
	 * @param sql
	 * @return
	 */
	public DBModel executeQuery(String jndi, String sql) {
		DBModel dbModel = new DBModel();
		Connection conn = null;
		Statement stat = null;
		ResultSet rs = null;
		try {
			conn = DBManager.getInstance().getConnection(jndi);
			stat = conn.createStatement();
			rs = stat.executeQuery(sql);
			dbModel.setResultSet(conn, stat, rs);
		} catch (Exception e) {
			e.printStackTrace();
			System.err.println("执行失败sql:" + sql);
		}
		return dbModel;
	}

	/**
	 * 异步查询数据库
	 * 
	 * @param jndi
	 * @param sql
	 * @param object
	 * @param methodName
	 * @return
	 */
	public void asynchronousExecuteQuery(String jndi, String sql,
			Object object, String methodName) {
		if (ThreadPoolManager.getManager().getIdleThread("dbSelect") != null) {
			ThreadPoolManager.getManager().getIdleThread("dbSelect").setValues(
					jndi, sql, object, methodName);
		} else {
			System.err.println("异步查询线程不够");
		}
	}

	/**
	 * 查询数据
	 * 
	 * @param sql
	 * @return
	 */
	public DBModel executeQuery(String sql) {
		DBModel dbModel = new DBModel();
		Connection conn = null;
		Statement stat = null;
		ResultSet rs = null;
		try {
			conn = DBManager.getInstance().getConnection();
			stat = conn.createStatement();
			rs = stat.executeQuery(sql);
			dbModel.setResultSet(conn, stat, rs);
		} catch (Exception e) {
			e.printStackTrace();
			System.err.println("执行失败sql:" + sql);
		}
		return dbModel;
	}

	/**
	 * 查询缓存数据
	 * 
	 * @param sql
	 * @return
	 */
	public DBModel cacheQuery(String jndi, String sql) {
		StringBuffer sqlCache = new StringBuffer();
		sqlCache.append("select result from cache where sql='");
		sqlCache.append(sql);
		sqlCache.append("' and jndi='");
		sqlCache.append(jndi);
		sqlCache.append("'");

		DBModel dbModel = new DBModel();
		Connection conn = null;
		Statement stat = null;
		ResultSet rs = null;

		try {
			conn = DBManager.getInstance().getConnection("jdbc/cache");
			stat = conn.createStatement();
			rs = stat.executeQuery(sqlCache.toString());
			dbModel.setXmlValue(rs.getString("result"));
		} catch (Exception e) {
			e.printStackTrace();
			System.err.println("执行失败sql:" + sql);
		} finally {
			try {
				if (rs != null)
					rs.close();
				if (stat != null)
					stat.close();
				if (conn != null)
					conn.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		return dbModel;
	}

	/**
	 * 更新查询缓存
	 * 
	 * @param jndi
	 * @param sql
	 * @param result
	 * @return
	 */
	public int cacheUpdate(String jndi, String sql, String result) {
		StringBuffer cacheSql = new StringBuffer();
		cacheSql.append("insert into cache (sql,jndi, result,time) values ('");
		cacheSql.append(sql);
		cacheSql.append("','");
		cacheSql.append(jndi);
		cacheSql.append("','");
		cacheSql.append(result);
		cacheSql.append("',");
		cacheSql
				.append("julianday(strftime('%Y-%m-%d %H:%M:%S','now','localtime'))");
		cacheSql.append(");");

		int i = 0;
		Connection conn = null;
		Statement stat = null;
		try {
			conn = DBManager.getInstance().getConnection("jdbc/cache");
			stat = conn.createStatement();
			i = stat.executeUpdate(cacheSql.toString());
		} catch (Exception e) {
			e.printStackTrace();
			System.err.println("执行失败sql:" + sql);
		} finally {
			try {
				if (stat != null)
					stat.close();
				if (conn != null)
					conn.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		return i;
	}

	/**
	 * 缓冲查询查询数据
	 * 
	 * @param sql
	 * @return
	 */
	public DBModel executeCacheQuery(String jndi, String sql) {
		DBModel cacheModel = cacheQuery(jndi, sql);
		if (!cacheModel.isEmpty()) {
			return cacheModel;
		}

		DBModel dbModel = new DBModel();
		Connection conn = null;
		Statement stat = null;
		ResultSet rs = null;
		try {
			conn = DBManager.getInstance().getConnection(jndi);
			stat = conn.createStatement();
			rs = stat.executeQuery(sql);
			dbModel.setResultSet(conn, stat, rs);
		} catch (Exception e) {
			e.printStackTrace();
			System.err.println("执行失败sql:" + sql);
		}
		return dbModel;
	}

	/**
	 * 更新数据
	 * 
	 * @param jndi
	 * @param Sql
	 * @return
	 */
	public int executeUpdate(Connection conn, String sql) {
		int i = 0;
		Statement stat = null;
		try {
			stat = conn.createStatement();
			i = stat.executeUpdate(sql);
		} catch (Exception e) {
			e.printStackTrace();
			System.err.println("执行失败sql:" + sql);
		} finally {
			try {
				if (stat != null)
					stat.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		return i;
	}

	/**
	 * 更新数据
	 * 
	 * @param jndi
	 * @param sql
	 * @return
	 */
	public int executeUpdate(String jndi, String sql, String result) {
		int i = 0;
		Connection conn = null;
		Statement stat = null;
		try {
			conn = DBManager.getInstance().getConnection(jndi);
			stat = conn.createStatement();
			i = stat.executeUpdate(sql);
		} catch (Exception e) {
			e.printStackTrace();
			System.err.println("执行失败sql:" + sql);
		} finally {
			try {
				if (stat != null)
					stat.close();
				if (conn != null)
					conn.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		return i;
	}

	/**
	 * 更新数据
	 * 
	 * @param jndi
	 * @param sql
	 * @return
	 */
	public int executeUpdate(String jndi, String sql) {
		int i = 0;
		Connection conn = null;
		Statement stat = null;
		try {
			conn = DBManager.getInstance().getConnection(jndi);
			stat = conn.createStatement();
			i = stat.executeUpdate(sql);
		} catch (Exception e) {
			e.printStackTrace();
			System.err.println("执行失败sql:" + sql);
		} finally {
			try {
				if (stat != null)
					stat.close();
				if (conn != null)
					conn.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		return i;
	}

	/**
	 * 更新数据
	 * 
	 * @param sql
	 * @return
	 */
	public int executeUpdate(String sql) {
		int i = 0;
		Connection conn = null;
		Statement stat = null;
		try {
			conn = DBManager.getInstance().getConnection();
			stat = conn.createStatement();
			i = stat.executeUpdate(sql);
		} catch (Exception e) {
			e.printStackTrace();
			System.err.println("执行失败sql:" + sql);
		} finally {
			try {
				if (stat != null)
					stat.close();
				if (conn != null)
					conn.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		return i;
	}

	/**
	 * 加入缓存执行
	 * 
	 * @param jndi
	 * @param sql
	 */
	public void addBatchUpdate(String jndi, String sql) {
		map.addSql(jndi, sql);
	}

	/**
	 * 批量更新数据
	 * 
	 * @param jndi
	 * @param sql
	 * @return
	 */
	public synchronized int[] executeBatchUpdate(String jndi, List<String> sql) {
		int[] updateCount = null;
		Connection conn = null;
		Statement stat = null;
		try {
			conn = DBManager.getInstance().getConnection(jndi);
			stat = conn.createStatement(ResultSet.TYPE_SCROLL_SENSITIVE,
					ResultSet.CONCUR_UPDATABLE);
			conn.setAutoCommit(false);
			for (String s : sql) {
				stat.addBatch(s);
			}
			updateCount = stat.executeBatch();
			conn.commit();
			System.out.println("提交完成" + sql.size());
		} catch (Exception e) {
			e.printStackTrace();
			System.err.println("执行失败sql:" + sql);
		} finally {
			try {
				if (stat != null)
					stat.close();
				if (conn != null)
					conn.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
		return updateCount;
	}

	/**
	 * 记录sql语句
	 * 
	 * @param sql
	 */
	private void logSql(String sql) {
		if (logPolicy) {

		}
	}

	public int getBatchSqlSize() {
		return batchSqlSize;
	}

	public void setBatchSqlSize(int batchSqlSize) {
		this.batchSqlSize = batchSqlSize;
	}

	public int getBatchThreadSize() {
		return batchThreadSize;
	}

	public void setBatchThreadSize(int batchThreadSize) {
		this.batchThreadSize = batchThreadSize;
	}

	public int getSelectThreadSize() {
		return selectThreadSize;
	}

	public void setSelectThreadSize(int selectThreadSize) {
		this.selectThreadSize = selectThreadSize;
	}

}
