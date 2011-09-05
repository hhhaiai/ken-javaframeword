package com.shine.sourceflow.dao.show.strategy;

import com.shine.framework.utils.DateUtil;
import com.shine.framework.utils.TableUtil;
import com.shine.sourceflow.model.show.ShowGenericDto;

public class IPGroupTrafficStdQueryStrategy implements IQueryStrategy {
	@Override
	public String[] createDailyQuerySQL(ShowGenericDto dto) {
		String inSql = this.createGenericSql(dto, 
				TableUtil.getMonthTable(dto.getDate()), "a.src_ip",
				DateUtil.getDetailTime(DateUtil.getDateBegin(
				DateUtil.stringToDate(dto.getDate(),
				DateUtil.DATE_PATTERN_DEFAULT))), 
				DateUtil.getDetailTime(DateUtil.getDateEnd(
				DateUtil.stringToDate(dto.getDate(), 
				DateUtil.DATE_PATTERN_DEFAULT))));
		
		String outSql = this.createGenericSql(dto, 
				TableUtil.getMonthTable(dto.getDate()), "a.dst_ip",
				DateUtil.getDetailTime(DateUtil.getDateBegin(
				DateUtil.stringToDate(dto.getDate(),
				DateUtil.DATE_PATTERN_DEFAULT))), 
				DateUtil.getDetailTime(DateUtil.getDateEnd(
				DateUtil.stringToDate(dto.getDate(), 
				DateUtil.DATE_PATTERN_DEFAULT))));
		String[] sqls = {inSql, outSql};
		return sqls;
	}

	@Override
	public String[] createHourlyQuerySQL(ShowGenericDto dto) {
		String inSql = this.createGenericSql(dto, 
				TableUtil.getMonthTable(dto.getDate()), "a.src_ip",
				DateUtil.getDetailTime(DateUtil.getIntervalOfHour(-1)), 
				DateUtil.getDetailTime());
		
		String outSql = this.createGenericSql(dto, 
				TableUtil.getMonthTable(dto.getDate()), "a.dst_ip",
				DateUtil.getDetailTime(DateUtil.getIntervalOfHour(-1)), 
				DateUtil.getDetailTime());
		String[] sqls = {inSql, outSql};
		return sqls;
	}
	
	private String createGenericSql(ShowGenericDto dto, 
			String tableName, String fCondition, String bBegin, String bEnd) {
		StringBuffer sql = new StringBuffer();
		sql.append("select b.ip_alias, sum(a.bytes) as total_bytes from ");
		sql.append(tableName);
		sql.append(" as a, ip_group_config as b where ");
		sql.append(fCondition);
		sql.append(" between b.ip_start_address and b.ip_end_address and ");
		sql.append("a.log_time between '");
		sql.append(bBegin);
		sql.append("' and '");
		sql.append(bEnd);
		sql.append("' group by b.ip_alias limit ");
		sql.append(dto.getTopPageN());
		return sql.toString();
	}

	@Override
	public String[] createMonthlyQuerySQL(ShowGenericDto dto) {
		String inSql = this.createGenericSql(dto, 
				TableUtil.getMonthTable(dto.getDate()), "a.src_ip",
				DateUtil.getDetailTime(DateUtil.getMonthBegin(
				DateUtil.stringToDate(dto.getDate(),
				DateUtil.DATE_PATTERN_DEFAULT))), 
				DateUtil.getDetailTime(DateUtil.getMonthEnd(
				DateUtil.stringToDate(dto.getDate(), 
				DateUtil.DATE_PATTERN_DEFAULT))));
		
		String outSql = this.createGenericSql(dto, 
				TableUtil.getMonthTable(dto.getDate()), "a.dst_ip",
				DateUtil.getDetailTime(DateUtil.getMonthBegin(
				DateUtil.stringToDate(dto.getDate(),
				DateUtil.DATE_PATTERN_DEFAULT))), 
				DateUtil.getDetailTime(DateUtil.getMonthEnd(
				DateUtil.stringToDate(dto.getDate(), 
				DateUtil.DATE_PATTERN_DEFAULT))));
		String[] sqls = {inSql, outSql};
		return sqls;
	}

	@Override
	public String[] createWeeklyQuerySQL(ShowGenericDto dto) {
		String inSql = this.createGenericSql(dto, 
				TableUtil.getMonthTable(dto.getDate()), "a.src_ip",
				DateUtil.getDetailTime(DateUtil.getWeekBegin(
				DateUtil.stringToDate(dto.getDate(),
				DateUtil.DATE_PATTERN_DEFAULT))), 
				DateUtil.getDetailTime(DateUtil.getWeekEnd(
				DateUtil.stringToDate(dto.getDate(), 
				DateUtil.DATE_PATTERN_DEFAULT))));
		
		String outSql = this.createGenericSql(dto, 
				TableUtil.getMonthTable(dto.getDate()), "a.dst_ip",
				DateUtil.getDetailTime(DateUtil.getWeekBegin(
				DateUtil.stringToDate(dto.getDate(),
				DateUtil.DATE_PATTERN_DEFAULT))), 
				DateUtil.getDetailTime(DateUtil.getWeekEnd(
				DateUtil.stringToDate(dto.getDate(), 
				DateUtil.DATE_PATTERN_DEFAULT))));
		String[] sqls = {inSql, outSql};
		return sqls;
	}

	@Override
	public String createDailySumSQL(ShowGenericDto dto) {
		String sql = this.createGenericSumSql(
				TableUtil.getMonthTable(dto.getDate()), "a.src_ip",
				DateUtil.getDetailTime(DateUtil.getDateBegin(
				DateUtil.stringToDate(dto.getDate(),
				DateUtil.DATE_PATTERN_DEFAULT))), 
				DateUtil.getDetailTime(DateUtil.getDateEnd(
				DateUtil.stringToDate(dto.getDate(), 
				DateUtil.DATE_PATTERN_DEFAULT))));
		return sql.toString();
	}

	@Override
	public String createHourlySumSQL(ShowGenericDto dto) {
		String sql = this.createGenericSumSql( 
				TableUtil.getMonthTable(dto.getDate()), "a.src_ip",
				DateUtil.getDetailTime(DateUtil.getIntervalOfHour(-1)), 
				DateUtil.getDetailTime());
		return sql.toString();
	}

	@Override
	public String createMonthlySumSQL(ShowGenericDto dto) {
		String sql = this.createGenericSumSql( 
				TableUtil.getMonthTable(dto.getDate()), "a.src_ip",
				DateUtil.getDetailTime(DateUtil.getMonthBegin(
				DateUtil.stringToDate(dto.getDate(),
				DateUtil.DATE_PATTERN_DEFAULT))), 
				DateUtil.getDetailTime(DateUtil.getMonthEnd(
				DateUtil.stringToDate(dto.getDate(), 
				DateUtil.DATE_PATTERN_DEFAULT))));
		return sql.toString();
	}

	@Override
	public String createWeeklySumSQL(ShowGenericDto dto) {
		String sql = this.createGenericSumSql( 
				TableUtil.getMonthTable(dto.getDate()), "a.src_ip",
				DateUtil.getDetailTime(DateUtil.getWeekBegin(
				DateUtil.stringToDate(dto.getDate(),
				DateUtil.DATE_PATTERN_DEFAULT))), 
				DateUtil.getDetailTime(DateUtil.getWeekEnd(
				DateUtil.stringToDate(dto.getDate(), 
				DateUtil.DATE_PATTERN_DEFAULT))));
		return sql.toString();
	}
	
	private String createGenericSumSql(String tableName, String fCondition,
			String bBegin, String bEnd) {
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
