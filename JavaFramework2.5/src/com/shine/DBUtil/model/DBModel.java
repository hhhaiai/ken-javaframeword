package com.shine.DBUtil.model;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
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

	// 每页缓存条数
	private int maxRows = 1000;

	// 页数
	private int page = -1;

	private Connection conn;
	private Statement stat;
	private ResultSet rs;

	public DBModel() {
	}

	public DBModel(Connection conn, Statement stat, ResultSet rs) {
		setResultSet(conn, stat, rs);
	}

	/**
	 * 导入数据集
	 * 
	 * @param rs
	 */
	public void setResultSet(Connection conn, Statement stat, ResultSet rs) {
		try {
			this.conn = conn;
			this.stat = stat;
			this.rs = rs;
			ResultSetMetaData md = rs.getMetaData();
			for (int j = 0; j < md.getColumnCount(); j++) {
				columnName.add(md.getColumnName(j + 1));
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}

	/**
	 * 从xml中获取数据
	 * 
	 * @param xml
	 */
	public void setXmlValue(String xml) {
		boolean b = true;

		List<Element> elementList = XmlUitl.getAllElement(XmlUitl
				.string2Document(xml).getRootElement(), "node");
		for (Element ele : elementList) {
			List<Element> arrList = XmlUitl.getAllElement(ele, "key");
			DBRowModel dbRowModel = new DBRowModel();
			for (Element keyElement : arrList) {
				if (b) {
					columnName.clear();
					columnName.add(keyElement.attributeValue("label"));
				}
				dbRowModel.put(keyElement.attributeValue("label"), keyElement
						.getText());
				b = false;
			}
			this.add(dbRowModel);
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
			if (j > 2000) {
				System.out.println("查询数据 >2000行，安全机制防止溢出,只是显示部分数据！请才用分页查询！");
				break;
			}

			Element dataElement = configElement.addElement("node");
			DBRowModel dbRowModel = (DBRowModel) this.get(j);
			for (int i = 0; i < columnName.size(); i++) {
				if (dbRowModel.get(columnName.get(i)) != null) {
					if (XmlUitl.getStringType(
							(String) dbRowModel.get(columnName.get(i))).equals(
							"XML")) {
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

	/**
	 * 加载下1000行数据
	 * 
	 * @throws SQLException
	 */
	public int next() throws SQLException {
		this.clear();
		int i = 0;
		while (rs.next()) {
			// 防止数据溢出
			if (i > maxRows) {
				break;
			}

			DBRowModel dbRowModel = new DBRowModel();
			for (int j = 0; j < columnName.size(); j++) {
				dbRowModel.put(columnName.get(j), rs.getString(j + 1));
			}
			this.add(dbRowModel);
			i++;
		}
		page++;
		return this.size();
	}

	/**
	 * model回到原点
	 * 
	 * @throws SQLException
	 */
	public void beforeFirst() throws SQLException {
		rs.beforeFirst();
		page = -1;
		next();
	}

	/**
	 * 获取其中某页数据
	 * 
	 * @param page
	 * @return
	 * @throws SQLException
	 */
	public DBModel getPageValues(int page, int maxRows) throws SQLException {
		this.maxRows = maxRows;
		return getPageValues(page);
	}

	/**
	 * 获取其中某页数据
	 * 
	 * @param page
	 * @return
	 * @throws SQLException
	 */
	public DBModel getPageValues(int page) throws SQLException {
		this.page = page;
		rs.absolute(page * maxRows);
		next();
		return this;
	}

	/**
	 * 部分关闭,关闭ResultSet和Statement
	 */
	public void closePart() {
		try {
			if (this.rs != null)
				this.rs.close();

			if (this.stat != null)
				this.stat.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * 全部关闭,关闭Connection,ResultSet和Statement
	 */
	public void close() {
		try {
			if (this.rs != null)
				this.rs.close();

			if (this.stat != null)
				this.stat.close();

			if (this.conn != null)
				this.conn.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public int getMaxRows() {
		return maxRows;
	}

	public void setMaxRows(int maxRows) {
		this.maxRows = maxRows;
	}

	public int getPage() {
		return page;
	}

	public void setPage(int page) {
		this.page = page;
	}

	public Connection getConn() {
		return conn;
	}

	public void setConn(Connection conn) {
		this.conn = conn;
	}

	public Statement getStat() {
		return stat;
	}

	public void setStat(Statement stat) {
		this.stat = stat;
	}

	public ResultSet getRs() {
		return rs;
	}

	public void setRs(ResultSet rs) {
		this.rs = rs;
	}

}
