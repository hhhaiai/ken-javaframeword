package com.shine.netflow.job;

import com.shine.framework.DBUtil.DBUtil;
import com.shine.framework.core.util.DateUtil;
import com.shine.netflow.utils.NetflowHelper;

/**
 * 计划任务数据库存储适配器,专门辅助计划任务操作数据库
 */
public class DBJobAdapter {
	private static final String JNDI = "jdbc/flow";
	private static final String SUB_SQL = 
		"router_id,src_ip,src_port,dst_ip,dst_port,in_if,out_if,protocol,bytes,log_time";
	
	public DBJobAdapter() {
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
		String date = DateUtil.getCurrentDate();
		StringBuffer sql = new StringBuffer();
		sql.append("insert into ");
		sql.append(NetflowHelper.getHelper().getDateTableName());
		sql.append("(").append(SUB_SQL).append(")");
		sql.append(" select ").append(SUB_SQL).append(" from ");
		sql.append(table);
		sql.append(" where TO_DAYS(log_time) = TO_DAYS('");
		sql.append(date).append("')");
		DBUtil.getInstance().executeUpdate(JNDI, sql.toString());
	}
	
	/**
	 * 删除数据
	 * 
	 * @param table 数据表名称
	 */
	public void truncateDate(String table) {
		StringBuffer sql = new StringBuffer(30);
		sql.append("truncate table ");
		sql.append(table);
		DBUtil.getInstance().executeUpdate(sql.toString());
	}
}
