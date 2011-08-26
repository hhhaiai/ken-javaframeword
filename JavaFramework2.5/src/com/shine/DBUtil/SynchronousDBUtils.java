package com.shine.DBUtil;

import java.sql.SQLException;

import com.shine.DBUtil.model.DBModel;
import com.shine.DBUtil.model.DBRowModel;
import com.shine.framework.ThreadPoolUtil.ThreadPoolManager;
import com.shine.framework.core.util.DateUtil;

public class SynchronousDBUtils {
	private static SynchronousDBUtils utils = null;

	public static SynchronousDBUtils getUtils() {
		if (utils == null)
			utils = new SynchronousDBUtils();
		return utils;
	}

	/**
	 * 同步表数据
	 * 
	 * @param sourceJndi
	 * @param sourceTable
	 * @param targetJndi
	 * @param targetTable
	 * @throws SQLException
	 * @throws InterruptedException
	 */
	public void synchronousTabel(String sourceJndi, String sourceTable,
			String targetJndi, String targetTable) throws SQLException,
			InterruptedException {
		DBModel dbmodel = null;
		try {
			// 检查是否存在表
			if (!checkTable(sourceJndi, sourceTable))
				return;

			if (!checkTable(targetJndi, targetTable))
				return;

			// 检查是否存在相同表结构
			if (!compareTable(sourceJndi, sourceTable, targetJndi, targetTable))
				return;

			// 获取所有数据
			dbmodel = DBUtil.getInstance().executeQueryTable(sourceJndi,
					sourceTable);
			while (dbmodel.next() != 0) {
				for (DBRowModel rowModel : dbmodel) {
					DBUtil.getInstance().addBatchUpdate(targetJndi,
							createSql(targetTable, rowModel));
				}

				Thread.sleep(100);
			}
			DBUtil.getInstance().cleanBatchUpdate(targetJndi);
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (dbmodel != null)
				dbmodel.close();
		}
	}

	/**
	 * 检查是否存在该表
	 * 
	 * @param jndi
	 * @param tableName
	 * @return
	 * @throws SQLException
	 */
	public boolean checkTable(String jndi, String tableName)
			throws SQLException {
		DBModel dbmodel = DBUtil.getInstance().getAllTables(jndi, null);

		while (dbmodel.next() != 0) {
			for (int i = 0; i < dbmodel.size(); i++) {
				if (dbmodel.get(i).getString("TABLE_NAME").equals(tableName)) {
					dbmodel.close();
					return true;
				}
			}
		}
		dbmodel.close();
		return false;
	}

	/**
	 * 比较数据库是否有同样的字段
	 * 
	 * @param SourceJndi
	 * @param sourceTable
	 * @param targetJndi
	 * @param targetTable
	 * @return
	 */
	public boolean compareTable(String SourceJndi, String sourceTable,
			String targetJndi, String targetTable) {
		DBModel sourceDBModel = null;
		DBModel targetDBModel = null;
		try {
			sourceDBModel = DBUtil.getInstance().getTableColumns(SourceJndi,
					null, sourceTable);
			targetDBModel = DBUtil.getInstance().getTableColumns(targetJndi,
					null, targetTable);

			// 加载其中一页数据
			while (sourceDBModel.next() != 0 && targetDBModel.next() != 0) {
				if (sourceDBModel.size() != targetDBModel.size())
					return false;

				for (int i = 0; i < sourceDBModel.size(); i++) {
					if (!sourceDBModel.get(i).getString("COLUMN_NAME").equals(
							targetDBModel.get(i).getString("COLUMN_NAME"))) {
						System.out.println(sourceDBModel.get(i).getString(
								"COLUMN_NAME"));
						System.out.println(targetDBModel.get(i).getString(
								"COLUMN_NAME"));
						return false;
					}

				}
			}
			return true;

		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (sourceDBModel != null)
				sourceDBModel.close();
			if (targetDBModel != null)
				targetDBModel.close();
		}
		return false;
	}

	/**
	 * 镜像表
	 * 
	 * @param SourceJndi
	 * @param sourceTable
	 * @param targetJndi
	 * @param targetTable
	 * @return
	 */
	public boolean moirrorTable(String SourceJndi, String sourceTable,
			String targetJndi, String targetTable) {
		DBModel sourceDBModel = null;
		try {
			sourceDBModel = DBUtil.getInstance().getTableColumns(SourceJndi,
					null, sourceTable);

			StringBuffer createSql = new StringBuffer();
			createSql.append("create table ");
			createSql.append(targetTable);
			createSql.append(" (");

			while (sourceDBModel.next() != 0) {
				for (int i = 0; i < sourceDBModel.size(); i++) {
					if (sourceDBModel.get(i).getString("TYPE_NAME").equals(
							"varchar")) {
						createSql.append(sourceDBModel.get(i).getString(
								"COLUMN_NAME")
								+ " "
								+ sourceDBModel.get(i).getString("TYPE_NAME")
								+ "("
								+ sourceDBModel.get(i).getString("COLUMN_SIZE")
								+ ")" + ",");
					} else {
						createSql.append(sourceDBModel.get(i).getString(
								"COLUMN_NAME")
								+ " "
								+ sourceDBModel.get(i).getString("TYPE_NAME")
								+ ",");
					}
				}
			}
			createSql.delete(createSql.length() - 1, createSql.length());
			createSql.append(")");

			DBUtil.getInstance()
					.executeUpdate(targetJndi, createSql.toString());
			return true;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return false;
	}

	/**
	 * 镜像表到monetdb
	 * 
	 * @param SourceJndi
	 * @param sourceTable
	 * @param targetJndi
	 * @param targetTable
	 * @return
	 */
	public boolean moirrorMonetdbTable(String SourceJndi, String sourceTable,
			String targetJndi, String targetTable) {
		DBModel sourceDBModel = null;
		try {
			sourceDBModel = DBUtil.getInstance().getTableColumns(SourceJndi,
					null, sourceTable);

			StringBuffer createSql = new StringBuffer();
			createSql.append("create table ");
			createSql.append(targetTable);
			createSql.append(" (");

			while (sourceDBModel.next() != 0) {
				for (int i = 0; i < sourceDBModel.size(); i++) {
					if (sourceDBModel.get(i).getString("TYPE_NAME").equals(
							"varchar")) {
						createSql.append(sourceDBModel.get(i).getString(
								"COLUMN_NAME")
								+ " "
								+ sourceDBModel.get(i).getString("TYPE_NAME")
								+ "("
								+ sourceDBModel.get(i).getString("COLUMN_SIZE")
								+ ")" + ",");
					} else if (sourceDBModel.get(i).getString("TYPE_NAME")
							.equals("datetime")) {
						createSql.append(sourceDBModel.get(i).getString(
								"COLUMN_NAME")
								+ " TIMESTAMP,");
					} else {
						createSql.append(sourceDBModel.get(i).getString(
								"COLUMN_NAME")
								+ " "
								+ sourceDBModel.get(i).getString("TYPE_NAME")
								+ ",");
					}
				}
			}
			createSql.delete(createSql.length() - 1, createSql.length());
			createSql.append(")");

			DBUtil.getInstance()
					.executeUpdate(targetJndi, createSql.toString());
			return true;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return false;
	}

	/**
	 * 构架sql
	 * 
	 * @param targetTable
	 * @param rowModel
	 * @return
	 */
	public String createSql(String targetTable, DBRowModel rowModel) {
		try {
			StringBuffer sql = new StringBuffer();
			sql.append("insert into ");
			sql.append(targetTable);
			sql.append(" values('");
			for (String value : rowModel.values()) {
				sql.append(value);
				sql.append("','");
			}
			sql.delete(sql.length() - 2, sql.length());
			sql.append(");");
			return sql.toString();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	public static void main(String args[]) throws SQLException,
			InterruptedException {
		DBUtil
				.getInstance()
				.init(
						"E:\\workspace\\JavaFramework2.5\\src\\com\\shine\\DBUtil\\config\\dbXml.xml");

		// System.out.println(SynchronousDBUtils.getUtils().moirrorMonetdbTable(
		// "jdbc/flow", "rawnetflow_hour_12", "jdbc/MonetDB",
		// "rawnetflow_hour_12"));

		SynchronousDBUtils.getUtils().synchronousTabel("jdbc/test", "test1",
				"jdbc/Cluster2", "test1");
	}
}
