package com.shine.netflow.job.dao;

import java.util.ArrayList;
import java.util.List;

import com.shine.DBUtil.DBUtil;
import com.shine.framework.utils.TableUtil;
import com.shine.netflow.utils.NetflowHelper;

public class CreateImmediateTableDao extends GenericDao {
	/**
	 * 创建今天和明天，当月和第二个月的数据表（如果表不存在）
	 */
	public void createTable() {
		DBUtil.getInstance().executeBatchUpdate(JNDI, this.createSqls());
	}

	private List<String> createSqls() {
		List<String> sqls = new ArrayList<String>();
		sqls.add(NetflowHelper.getHelper().createTableSql(
				TableUtil.getTodayTable()));
		sqls.add(NetflowHelper.getHelper().createTableSql(
				TableUtil.getTomorrowTable()));
		sqls.add(NetflowHelper.getHelper().createTableSql(
				TableUtil.getCurrentMonthTable()));
		sqls.add(NetflowHelper.getHelper().createTableSql(
				TableUtil.getNextMonthTable()));
		return sqls;
	}
}
