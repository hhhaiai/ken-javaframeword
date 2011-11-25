package com.shine.sourceflow.dao.show.strategy;

import com.shine.framework.utils.DateUtil;
import com.shine.framework.utils.TableUtil;
import com.shine.sourceflow.model.show.ShowGenericDto;

/**
 * IP流量标准查询策略
 */
public class IPTrafficStdQueryStrategy implements IQueryStrategy {

	private static final String SQL_SRCIP_FIELD = "src_ip,sum(bytes) as total_bytes";
	private static final String SQL_DSTIP_FIELD = "dst_ip,sum(bytes) as total_bytes";
	private static final String SQL_SRCIP_GROUPBY = "group by src_ip";
	private static final String SQL_DSTIP_GROUPBY = "group by dst_ip";
	private static final String SQL_ORDERBY = "order by total_bytes desc";

	public String[] createHourlyQuerySQL(ShowGenericDto dto) {
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

	public String[] createDailyQuerySQL(ShowGenericDto dto) {
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

	public String[] createMonthlyQuerySQL(ShowGenericDto dto) {
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

	public String[] createWeeklyQuerySQL(ShowGenericDto dto) {
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
			ShowGenericDto dto, String field, String tableName, 
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

	public String createDailySumSQL(ShowGenericDto dto) {
		String sql = this.createGenericSumSQL(
				TableUtil.getMonthTable(dto.getDate()),
				DateUtil.getDetailTime(DateUtil.getDateBegin(
				DateUtil.stringToDate(dto.getDate(),
				DateUtil.DATE_PATTERN_DEFAULT))), 
				DateUtil.getDetailTime(DateUtil.getDateEnd(
				DateUtil.stringToDate(dto.getDate(), 
				DateUtil.DATE_PATTERN_DEFAULT))));
		return sql.toString();
	}

	public String createHourlySumSQL(ShowGenericDto dto) {
		String sql = this.createGenericSumSQL(
				TableUtil.getMonthTable(dto.getDate()),
				DateUtil.getDetailTime(DateUtil.getIntervalOfHour(-1)), 
				DateUtil.getDetailTime());
		return sql.toString();
	}

	public String createMonthlySumSQL(ShowGenericDto dto) {
		String sql = this.createGenericSumSQL(
				TableUtil.getMonthTable(dto.getDate()),
				DateUtil.getDetailTime(DateUtil.getMonthBegin(
				DateUtil.stringToDate(dto.getDate(),
				DateUtil.DATE_PATTERN_DEFAULT))), 
				DateUtil.getDetailTime(DateUtil.getMonthEnd(
				DateUtil.stringToDate(dto.getDate(), 
				DateUtil.DATE_PATTERN_DEFAULT))));
		return sql.toString();
	}

	public String createWeeklySumSQL(ShowGenericDto dto) {
		String sql = this.createGenericSumSQL(
				TableUtil.getMonthTable(dto.getDate()),
				DateUtil.getDetailTime(DateUtil.getWeekBegin(
				DateUtil.stringToDate(dto.getDate(), 
				DateUtil.DATE_PATTERN_DEFAULT))), 
				DateUtil.getDetailTime(DateUtil.getWeekEnd(
				DateUtil.stringToDate(dto.getDate(), 
				DateUtil.DATE_PATTERN_DEFAULT))));
		return sql.toString();
	}
	
	private String createGenericSumSQL(String tableName, String bBegin, String bEnd) {
		StringBuffer sql = new StringBuffer();
		sql.append("select sum(bytes) as bytes_sum from ");
		sql.append(tableName);
		sql.append(" where log_time between '");
		sql.append(bBegin);
		sql.append("' and '");
		sql.append(bEnd);
		sql.append("'");
		return sql.toString();
	}
}
