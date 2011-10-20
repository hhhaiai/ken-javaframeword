package com.shine.netflow.job.dao;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import com.shine.DBUtil.DBUtil;
import com.shine.DBUtil.manage.DBManager;
import com.shine.framework.utils.TableUtil;
import com.shine.netflow.utils.NetflowHelper;

public class CreateMonthlyTableDao extends GenericDao {
	/**
	 * 创建当月和第二个月的数据表（如果表不存在）
	 */
	public void createTable() {
		// 创建MYSQL数据表
		if (DBManager.getInstance().isDBPoolExists(JNDI_MYSQL)) {
			DBUtil.getInstance().executeBatchUpdate(JNDI_MYSQL, this.createMysqlSqls());
		}
		// 创建MONETDB数据表
		if (DBManager.getInstance().isDBPoolExists(JNDI_MONETDB)) {
			if (!this.checkTableExists()) {
				String createCurMonthSql = NetflowHelper.getHelper().createMonetDBTableSql(
						TableUtil.getCurrentMonthTable());
				String createNextMonthSql = NetflowHelper.getHelper().createMonetDBTableSql(
						TableUtil.getNextMonthTable());
				DBUtil.getInstance().executeUpdate(JNDI_MONETDB, createCurMonthSql);
				DBUtil.getInstance().executeUpdate(JNDI_MONETDB, createNextMonthSql);
			}
		}
	}

	private List<String> createMysqlSqls() {
		List<String> sqls = new ArrayList<String>();
		sqls.add(NetflowHelper.getHelper().createMysqlTableSql(
				TableUtil.getCurrentMonthTable()));
		sqls.add(NetflowHelper.getHelper().createMysqlTableSql(
				TableUtil.getNextMonthTable()));
		return sqls;
	}
	
	/**
	 * 检查要创建的MONETDB表是否存在
	 * 
	 * @return 存在返回true
	 */
	private boolean checkTableExists() {
		Connection conn = DBManager.getInstance().getConnection(JNDI_MONETDB);
		Statement stmt = null;
		ResultSet rs = null;
		try {
			stmt = conn.createStatement();
			rs = stmt.executeQuery("select 1 from " + TableUtil.getCurrentMonthTable());
		} catch (Exception e) {
			return false;
		} finally {
			try {
				if (stmt != null) {
					stmt.close();
				}
				if (rs != null) {
					rs.close();
				}
				if (conn != null) {
					conn.close();
				}
			} catch (SQLException e) {
			}
		}
		return true;
	}
}
