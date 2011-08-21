package com.shine.framework.dao.util;

/**
 * 查询SQL 包括预处理参数/值
 * @author JiangKunpeng	2011.05.17
 * @version 2011.05.17
 */
public class QuerySQL {
	private String sql;
	private String[] params;
	private Object[] values;
	
	public String getSql() {
		return sql;
	}
	public void setSql(String sql) {
		this.sql = sql;
	}
	public String[] getParams() {
		return params;
	}
	public void setParams(String[] params) {
		this.params = params;
	}
	public Object[] getValues() {
		return values;
	}
	public void setValues(Object[] values) {
		this.values = values;
	}
}
