package com.shine.framework.DBUtil;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.List;

import com.shine.framework.DBUtil.manage.DBManager;
import com.shine.framework.DBUtil.model.DBModel;
import com.shine.framework.DBUtil.utils.BatchMap;

public class DBUtil {

	private static DBUtil util = new DBUtil();
	private int batchSqlSize = 200;
	private BatchMap map = new BatchMap();

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
			dbModel.setResultSet(rs);
		} catch (Exception e) {
			e.printStackTrace();
			System.err.println("执行失败sql:" + sql);
		} finally {
			try {
				if (rs != null)
					rs.close();
				if (stat != null)
					stat.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
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
			// stat = conn.createStatement(ResultSet.TYPE_SCROLL_SENSITIVE,
			// ResultSet.CONCUR_READ_ONLY);
			stat = conn.createStatement();
			rs = stat.executeQuery(sql);
			dbModel.setResultSet(rs);
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
			dbModel.setResultSet(rs);
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
			// dbModel.setResultSet(rs);
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
			dbModel.setResultSet(rs);
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
	public int[] executeBatchUpdate(String jndi, List<String> sql) {
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

	public int getBatchSqlSize() {
		return batchSqlSize;
	}

	public void setBatchSqlSize(int batchSqlSize) {
		this.batchSqlSize = batchSqlSize;
	}
}
