package com.shine.framework.DBUtil.model;

import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.dom4j.Document;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;

import com.shine.framework.core.util.XmlUitl;

public final class DBModel extends ArrayList<DBRowModel> {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	// 列名集
	private List<String> columnName = new ArrayList<String>();

	public DBModel() {
	}

	public DBModel(ResultSet rs) {
		setResultSet(rs);
	}

	/**
	 * 导入数据集
	 * 
	 * @param rs
	 */
	public void setResultSet(ResultSet rs) {
		try {
			ResultSetMetaData md = rs.getMetaData();
			for (int j = 0; j < md.getColumnCount(); j++) {
				columnName.add(md.getColumnName(j + 1));
			}

			int i = 0;
			while (rs.next()) {
				// 防止数据溢出
				if (i > 50000) {
					System.out.println("查询数据 >50000行，安全机制防止溢出！");
					break;
				}

				DBRowModel dbRowModel = new DBRowModel();
				for (int j = 0; j < md.getColumnCount(); j++) {
					dbRowModel.put(columnName.get(j), rs.getString(j + 1));
				}
				this.add(dbRowModel);
				i++;
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}

	/**
	 * 获取某行的数据
	 * 
	 * @param i
	 * @return
	 */
	public DBRowModel getRow(int i) {
		if (i < this.size()) {
			return this.get(i);
		} else {
			System.out.println("数据库行溢出");
			return null;
		}
	}

	/**
	 * 获取xml结构的数据库数据
	 * 
	 * @return
	 */
	public String getDataXml() {
		Document document = DocumentHelper.createDocument();
		Element configElement = document.addElement("nodes");

		for (int j = 0; j < this.size(); j++) {
			// 防止数据溢出
			if (j > 1000) {
				System.out.println("生成xml数据 >1000行，安全机制防止溢出！");
				break;
			}

			Element dataElement = configElement.addElement("node");
			DBRowModel dbRowModel = (DBRowModel) this.get(j);
			for (int i = 0; i < columnName.size(); i++) {
				if (dbRowModel.get(columnName.get(i)) != null) {
					if (XmlUitl.getStringType(
							(String) dbRowModel.get(columnName.get(i))).equals(
							"XML")) {
						// (dataElement.addElement(columnName.get(String
						// .valueOf(i)))).add(DataUtil.string2Document(
						// (String) dbRowModel.get(columnName.get(String
						// .valueOf(i)))).getRootElement());

						dataElement.addElement("key").addAttribute("label",
								columnName.get(i)).add(
								XmlUitl.string2Document(
										(String) dbRowModel.get(columnName
												.get(i))).getRootElement());
					} else {
						dataElement.addElement("key").addAttribute("label",
								columnName.get(i)).setText(
								(String) dbRowModel.get(columnName.get(i)));
					}
				} else {
					dataElement.addElement(columnName.get(i));
				}
			}
		}
		return XmlUitl.doc2String(document);
	}

	/**
	 * 获取数组结构的数据库数据
	 * 
	 * @return
	 */
	public String[][] getArray() {
		DBRowModel dbRowModel;
		String[][] array = null;
		for (int i = 0; i < this.size(); i++) {
			dbRowModel = (DBRowModel) this.get(i);
			for (int j = 0; j < dbRowModel.size(); j++) {
				if (array == null)
					array = new String[this.size()][dbRowModel.size()];
				array[i][j] = (String) dbRowModel.get((String) columnName
						.get(j));
			}
		}
		return array;
	}

	/**
	 * 获取某列的数据
	 * 
	 * @param column
	 * @return
	 */
	public DBColumnModel getCumnModel(String column) {
		DBColumnModel dbCumnModel = new DBColumnModel();
		for (int j = 0; j < this.size(); j++) {
			DBRowModel dbRowModel = (DBRowModel) this.get(j);
			for (int i = 0; i < columnName.size(); i++) {
				if (column.equals(columnName.get(i))) {
					dbCumnModel.put(String.valueOf(j), (String) dbRowModel
							.get(columnName.get(i)));
				}
			}
		}
		return dbCumnModel;
	}

	/**
	 * 增加列名
	 * 
	 * @param column_name
	 */
	public void addColumnName(String column_name) {
		if (!columnName.contains(column_name))
			columnName.add(column_name);
	}

}
