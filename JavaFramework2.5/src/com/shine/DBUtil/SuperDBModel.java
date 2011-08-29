package com.shine.DBUtil;

import java.sql.SQLException;

import com.shine.DBUtil.manage.DBManager;
import com.shine.DBUtil.model.DBModel;

/**
 * 
 * 带数据库操作的dbmodel
 * 
 * @author viruscodecn@gmail.com
 * 
 */
public final class SuperDBModel extends DBModel {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private String jndi;
	private String tableName;

	public void init(String jndi, String tableName) throws SQLException {
		this.jndi = jndi;
		this.tableName = tableName;

		// 检查是否存在表
		if (!SynchronousDBUtils.getUtils().checkTable(jndi, tableName)) {
			System.out.println(jndi + "不存在表:" + tableName);
			return;
		}

		DBModel columnsDBmodel = DBUtil.getInstance().getTableColumns(jndi,
				null, tableName);
		this.columnName.clear();
		while (columnsDBmodel.next() != 0) {
			for (int i = 0; i < columnsDBmodel.size(); i++) {
				this.columnName.add(columnsDBmodel.get(i).getString(
						"COLUMN_NAME"));
			}
		}
	}

	/**
	 * 查询数据
	 */
	public void query() {
		this.reSetResult(DBManager.getInstance().getConnection(jndi), this.sql);
	}

	/**
	 * 插入数据
	 * 
	 * @param values
	 */
	public void insert(String... values) {
		if (this.columnName.size() == values.length) {
			DBUtil.getInstance().executeUpdate(jndi, createInsertSql(values));
		} else {
			System.err.println(this.jndi + "插入" + tableName + "数据库列数不对!");
		}
	}

	public void delete(String... options) {

	}

	public void createDeleteSql(String... options) {
		StringBuffer sql = new StringBuffer();
		sql.append("delete from ");
		sql.append(tableName);
		sql.append(" where 1=1");
		for (String option : options) {
			sql.append(" ");
			sql.append(option);
			sql.append(" ");
		}
	}

	/**
	 * 生成 insert sql
	 * 
	 * @param values
	 * @return
	 */
	public String createInsertSql(String... values) {
		StringBuffer sql = new StringBuffer();
		sql.append("insert into ");
		sql.append(tableName);
		sql.append(" values('");
		for (String value : values) {
			sql.append(value);
			sql.append("','");
		}
		sql.delete(sql.length() - 2, sql.length());
		sql.append(");");
		return sql.toString();
	}

	public String getJndi() {
		return jndi;
	}

	public void setJndi(String jndi) {
		this.jndi = jndi;
	}

	public String getTableName() {
		return tableName;
	}

	public void setTableName(String tableName) {
		this.tableName = tableName;
	}

}
