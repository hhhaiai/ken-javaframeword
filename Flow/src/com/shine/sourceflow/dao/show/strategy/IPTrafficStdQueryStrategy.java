package com.shine.sourceflow.dao.show.strategy;

import com.shine.framework.utils.DateUtil;
import com.shine.framework.utils.TableUtil;
import com.shine.sourceflow.model.show.GenericDTO;

/**
 * IP流量标准查询策略
 */
public class IPTrafficStdQueryStrategy implements IQueryStrategy {
	private static final String SQL_SRCIP_FIELD = "src_ip,sum(bytes) as total_bytes";
	private static final String SQL_DSTIP_FIELD = "dst_ip,sum(bytes) as total_bytes";
	private static final String SQL_SRCIP_GROUPBY = "group by src_ip";
	private static final String SQL_DSTIP_GROUPBY = "group by dst_ip";
	private static final String SQL_ORDERBY = "order by total_bytes desc";

	@Override
	public String[] createHourlyQuerySQL(GenericDTO dto) {
		String srcipSql = this.createGenericSQL(
				dto, SQL_SRCIP_FIELD, TableUtil.getMonthTable(dto.getDate()),
				DateUtil.getDetailTime(DateUtil.getIntervalOfHour(-1)), 
				DateUtil.getDetailTime(), SQL_SRCIP_GROUPBY);
		
		String dstipSql = this.createGenericSQL(
				dto, SQL_DSTIP_FIELD, TableUtil.getMonthTable(dto.getDate()),
				DateUtil.getDetailTime(DateUtil.getIntervalOfHour(-1)), 
				DateUtil.getDetailTime(), SQL_DSTIP_GROUPBY);
		String[] sqls = {srcipSql, dstipSql};
		return sqls;
	}

	@Override
	public String[] createDailyQuerySQL(GenericDTO dto) {
		String srcipSql = this.createGenericSQL(
				dto, SQL_SRCIP_FIELD, TableUtil.getMonthTable(dto.getDate()),
				DateUtil.getDetailTime(DateUtil.getDateBegin(
				DateUtil.stringToDate(dto.getDate(),
				DateUtil.DATE_PATTERN_DEFAULT))), 
				DateUtil.getDetailTime(DateUtil.getDateEnd(
				DateUtil.stringToDate(dto.getDate(), 
				DateUtil.DATE_PATTERN_DEFAULT))), SQL_SRCIP_GROUPBY);
		String dstipSql = this.createGenericSQL(
				dto, SQL_DSTIP_FIELD, TableUtil.getMonthTable(dto.getDate()),
				DateUtil.getDetailTime(DateUtil.getDateBegin(
				DateUtil.stringToDate(dto.getDate(), 
				DateUtil.DATE_PATTERN_DEFAULT))), 
				DateUtil.getDetailTime(DateUtil.getDateEnd(
				DateUtil.stringToDate(dto.getDate(), 
				DateUtil.DATE_PATTERN_DEFAULT))), SQL_DSTIP_GROUPBY);
		String[] sqls = {srcipSql, dstipSql};
		return sqls;
	}

	@Override
	public String[] createMonthlyQuerySQL(GenericDTO dto) {
		String srcipSql = this.createGenericSQL(
				dto, SQL_SRCIP_FIELD, TableUtil.getMonthTable(dto.getDate()),
				DateUtil.getDetailTime(DateUtil.getMonthBegin(
				DateUtil.stringToDate(dto.getDate(),
				DateUtil.DATE_PATTERN_DEFAULT))), 
				DateUtil.getDetailTime(DateUtil.getMonthEnd(
				DateUtil.stringToDate(dto.getDate(), 
				DateUtil.DATE_PATTERN_DEFAULT))), SQL_SRCIP_GROUPBY);
		String dstipSql = this.createGenericSQL(
				dto, SQL_DSTIP_FIELD, TableUtil.getMonthTable(dto.getDate()),
				DateUtil.getDetailTime(DateUtil.getMonthBegin(
				DateUtil.stringToDate(dto.getDate(),
				DateUtil.DATE_PATTERN_DEFAULT))), 
				DateUtil.getDetailTime(DateUtil.getMonthEnd(
				DateUtil.stringToDate(dto.getDate(), 
				DateUtil.DATE_PATTERN_DEFAULT))), SQL_DSTIP_GROUPBY);
		String[] sqls = {srcipSql, dstipSql};
		return sqls;
	}

	@Override
	public String[] createWeeklyQuerySQL(GenericDTO dto) {
		String srcipSql = this.createGenericSQL(
				dto, SQL_SRCIP_FIELD, TableUtil.getMonthTable(dto.getDate()),
				DateUtil.getDetailTime(DateUtil.getWeekBegin(
				DateUtil.stringToDate(dto.getDate(), 
				DateUtil.DATE_PATTERN_DEFAULT))), 
				DateUtil.getDetailTime(DateUtil.getWeekEnd(
				DateUtil.stringToDate(dto.getDate(), 
				DateUtil.DATE_PATTERN_DEFAULT))), SQL_SRCIP_GROUPBY);
		String dstipSql = this.createGenericSQL(
				dto, SQL_DSTIP_FIELD, TableUtil.getMonthTable(dto.getDate()),
				DateUtil.getDetailTime(DateUtil.getWeekBegin(
				DateUtil.stringToDate(dto.getDate(), 
				DateUtil.DATE_PATTERN_DEFAULT))), 
				DateUtil.getDetailTime(DateUtil.getWeekEnd(
				DateUtil.stringToDate(dto.getDate(), 
				DateUtil.DATE_PATTERN_DEFAULT))), SQL_DSTIP_GROUPBY);
		String[] sqls = {srcipSql, dstipSql};
		return sqls;
	}
	
	private String createGenericSQL(
			GenericDTO dto, String field, String tableName, 
			String bBegin, String bEnd, String groupby) {
		StringBuffer sql = new StringBuffer();
		sql.append("select ");
		sql.append(field);
		sql.append(" from ");
		sql.append(tableName);
		sql.append(" where log_time between '");
		sql.append(bBegin);
		sql.append("' and '");
		sql.append(bEnd);
		sql.append("' ");
		sql.append(groupby);
		sql.append(" ");
		sql.append(SQL_ORDERBY);
		sql.append(" limit ");
		sql.append(dto.getTopPageN());
		return sql.toString();
	}
}
