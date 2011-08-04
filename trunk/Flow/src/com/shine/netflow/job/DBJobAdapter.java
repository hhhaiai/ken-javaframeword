package com.shine.netflow.job;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import com.shine.framework.DBUtil.DBUtil;
import com.shine.framework.DBUtil.model.DBModel;
import com.shine.framework.core.util.DateUtil;
import com.shine.netflow.utils.NetflowHelper;

/**
 * 计划任务数据库存储适配器,专门辅助计划任务操作数据库
 */
public class DBJobAdapter {
	private static final String JNDI = "jdbc/flow";
	private static final int QUERY_ROWS = 1000;
	private static final String SUB_SQL = 
		"router_id,src_ip,src_port,dst_ip,dst_port,in_if,out_if,protocol,bytes,log_time";
	
	private String startDate;
	private String endDate;
	
	public DBJobAdapter() {
		String date = DateUtil.getCurrentDate();
		this.startDate = date + " 00:00:00";
		this.endDate = date + " 23:59:59";
	}
	
	/**
	 * 创建当天数据表
	 */
	public void createTable() {
		String sql = NetflowHelper.getHelper().createDateTableSql();
		DBUtil.getInstance().executeUpdate(JNDI, sql);
	}
	
	/**
	 * 存储数据
	 * 
	 * @param table 数据表名称
	 */
	public void saveData(String table) {
		int rowCount = this.getRowCount(table);
		for (int index = 0; index < rowCount; index += QUERY_ROWS) {
			StringBuffer sql = new StringBuffer(100);
			sql.append("INSERT INTO `");
			sql.append(NetflowHelper.getHelper().getDateTableName());
			sql.append("`(").append(SUB_SQL).append(")");
			sql.append(" SELECT ").append(SUB_SQL).append(" FROM `");
			sql.append(table);
			sql.append("` WHERE `log_time` BETWEEN '");
			sql.append(this.startDate);
			sql.append("' AND '");
			sql.append(this.endDate);
			sql.append("' LIMIT ").append(index).append(", ").append(QUERY_ROWS);
			DBUtil.getInstance().executeUpdate(JNDI, sql.toString());
		}
	}
	
	/**
	 * 删除数据
	 * 
	 * @param table 数据表名称
	 */
	public void truncateDate(String table) {
		List<String> sqls = new ArrayList<String>();
		sqls.add(this._createTempTable(table));
		sqls.add(this._truncateTable(table));
		sqls.add(this._restoreTable(table));
		sqls.add(this._dropTempTable(table));
		DBUtil.getInstance().executeBatchUpdate(JNDI, sqls);
	}
	
	/**
	 * 获取表总行数
	 * 
	 * @param table 数据表名称
	 * @return 表总行数
	 */
	public int getRowCount(String table) {
		StringBuffer sql = new StringBuffer(50);
		sql.append("SELECT COUNT(`num`) AS max_count FROM ");
		sql.append(table);
		sql.append(" WHERE `log_time` BETWEEN '");
		sql.append(this.startDate);
		sql.append("' AND '");
		sql.append(this.endDate).append("'");
		DBModel dbModel = DBUtil.getInstance().executeQuery(JNDI, sql.toString());
		ResultSet result = dbModel.getRs();
		int rowCount = 0;
		try {
			if (result.next()) {
				rowCount = result.getInt("max_count");
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return rowCount;
	}
	
	/**
	 * 创建临时表
	 * 
	 * @param table 数据表名称
	 */
	private String _createTempTable(String table) {
		StringBuffer sql = new StringBuffer(50);
		sql.append("CREATE TEMPORARY TABLE `tmp_");
		sql.append(table);
		sql.append("` SELECT * FROM `");
		sql.append(table);
		sql.append("` WHERE `log_time` NOT BETWEEN '");
		sql.append(this.startDate);
		sql.append("' AND '");
		sql.append(this.endDate).append("'");
		return sql.toString();
	}
	
	/**
	 * 清空数据表
	 * 
	 * @param table 数据表名称
	 */
	private String _truncateTable(String table) {
		StringBuffer sql = new StringBuffer(50);
		sql.append("TRUNCATE TABLE ");
		sql.append(table);
		return sql.toString();
	}
	
	/**
	 * 恢复数据表数据
	 * 
	 * @param table 数据表名称
	 */
	private String _restoreTable(String table) {
		StringBuffer sql = new StringBuffer(50);
		sql.append("INSERT INTO `");
		sql.append(table);
		sql.append("` SELECT * FROM tmp_");
		sql.append(table);
		return sql.toString();
	}
	
	/**
	 * 删除临时数据表
	 * 
	 * @param table 数据表名称
	 * @return
	 */
	private String _dropTempTable(String table) {
		StringBuffer sql = new StringBuffer(50);
		sql.append("DROP TABLE `tmp_");
		sql.append(table).append("`");
		return sql.toString();
	}
}
