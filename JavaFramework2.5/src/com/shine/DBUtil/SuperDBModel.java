package com.shine.DBUtil;

import java.sql.SQLException;

import com.shine.DBUtil.manage.DBManager;
import com.shine.DBUtil.model.DBModel;
import com.shine.DBUtil.model.DBRowModel;

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
	public int insert(String... values) {
		if (this.columnName.size() == values.length) {
			return DBUtil.getInstance().executeUpdate(jndi,
					createInsertSql(values));
		} else {
			System.err.println(this.jndi + "插入" + tableName + "数据库列数不对!");
		}
		return 0;
	}

	/**
	 * 删除数据
	 * 
	 * @param sqlOptions
	 */
	public int delete(String sqlOptions) {
		if (sqlOptions != null) {
			return DBUtil.getInstance().executeUpdate(jndi,
					createDeleteSql(sqlOptions));
		} else {
			System.err.println(this.jndi + "删除数据条件不可以为null");
		}
		return 0;
	}

	/**
	 * 删除行数据
	 * 
	 * @param dbRow
	 * @return
	 */
	public int delete(DBRowModel dbRow) {
		if (dbRow != null) {
			return DBUtil.getInstance().executeUpdate(jndi,
					createDeleteSql(dbRow.toDeleteSql()));
		} else {
			System.err.println(this.jndi + "删除数据DBRowModel不可以为null");
		}
		return 0;
	}

	public int update(String updateSql) {
		return 0;
	}

	public int update(String option, String updateValueSql) {
		return 0;
	}

	/**
	 * 生成删除语句
	 * 
	 * @param sqlOptions
	 * @return
	 */
	public String createDeleteSql(String sqlOptions) {
		StringBuffer sql = new StringBuffer();
		sql.append("delete from ");
		sql.append(tableName);
		sql.append(" where 1=1 and ");
		sql.append(sqlOptions);
		return sql.toString();
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
