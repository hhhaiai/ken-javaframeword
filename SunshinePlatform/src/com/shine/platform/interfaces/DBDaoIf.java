package com.shine.platform.interfaces;

import java.sql.ResultSet;

import com.shine.platform.core.model.BaseIf;

public interface DBDaoIf extends BaseIf {
	public ResultSet executeQuery(String jndi, String sql);

	public int executeUpdate(String jndi, String sql);
}
