package com.shine.DataBaseSource.util;

import java.util.ArrayList;

import com.shine.DataBaseSource.model.OptionSqlModel;

public class OptionList extends ArrayList<OptionSqlModel> {
	/**
	 * 构造sql条件
	 * 
	 * @return
	 */
	public String getAllOption() {
		StringBuffer reusltSql = new StringBuffer();
		reusltSql.append("1=1 and ");
		for (OptionSqlModel model : this) {
			reusltSql.append(model.getSql() + " " + model.getType() + " ");
		}
		this.clear();
		return reusltSql.toString();
	}
}
