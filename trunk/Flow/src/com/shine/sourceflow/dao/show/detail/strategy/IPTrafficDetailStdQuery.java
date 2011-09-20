package com.shine.sourceflow.dao.show.detail.strategy;

import com.shine.framework.utils.TableUtil;
import com.shine.sourceflow.model.show.detail.DetailGenericDto;
import com.shine.sourceflow.utils.ChartDate;

public class IPTrafficDetailStdQuery implements IDetailQueryStrategy {
	private static final String SQL_FIELD = 
		"src_ip, src_port, dst_ip, dst_port, bytes, log_time";
	
	@Override
	public String createHourlyQuerySQL(DetailGenericDto dto) {
		return this.createQuerySql(TableUtil.getMonthTable(dto.getDate()), 
				dto, ChartDate.getPreHour(), ChartDate.getCurDate());
	}
	
	@Override
	public String createDailyQuerySQL(DetailGenericDto dto) {
		return this.createQuerySql(TableUtil.getMonthTable(dto.getDate()), 
				dto, ChartDate.getDateBegin(dto.getDate()), 
				ChartDate.getDateEnd(dto.getDate()));
	}

	@Override
	public String createMonthlyQuerySQL(DetailGenericDto dto) {
		return this.createQuerySql(TableUtil.getMonthTable(dto.getDate()), 
				dto, ChartDate.getMonthBegin(dto.getDate()), 
				ChartDate.getMonthEnd(dto.getDate()));
	}

	@Override
	public String createWeeklyQuerySQL(DetailGenericDto dto) {
		return this.createQuerySql(TableUtil.getMonthTable(dto.getDate()), 
				dto, ChartDate.getWeekBegin(dto.getDate()), 
				ChartDate.getWeekEnd(dto.getDate()));
	}
	
	private String createQuerySql(String tableName, 
			DetailGenericDto dto, String begin, String end) {
		String field = "src_ip";
		int ipType = dto.getIpType();
		if (ipType == 2) {
			field = "dst_ip";
		}
		StringBuffer sql = new StringBuffer();
		sql.append("select ");
		sql.append(SQL_FIELD);
		sql.append(" from ");
		sql.append(tableName);
		sql.append(" where ");
		sql.append(field);
		sql.append(" = '");
		sql.append(dto.getIpAddress());
		sql.append("' and log_time between '");
		sql.append(begin);
		sql.append("' and '");
		sql.append(end);
		sql.append("' limit ");
		sql.append(DetailGenericDto.PAGE_LIMIT);
		sql.append(" offset ");
		sql.append((dto.getCurPage() - 1) * DetailGenericDto.PAGE_LIMIT);
		return sql.toString();
	}

	@Override
	public String createDailyCountSQL(DetailGenericDto dto) {
		return this.createCountSql(TableUtil.getMonthTable(dto.getDate()),
				dto, ChartDate.getDateBegin(dto.getDate()),
				ChartDate.getDateEnd(dto.getDate()));
	}

	@Override
	public String createHourlyCountSQL(DetailGenericDto dto) {
		return this.createCountSql(TableUtil.getMonthTable(dto.getDate()),
				dto, ChartDate.getPreHour(), ChartDate.getCurDate());
	}
	
	@Override
	public String createMonthlyCountSQL(DetailGenericDto dto) {
		return this.createCountSql(TableUtil.getMonthTable(dto.getDate()),
				dto, ChartDate.getMonthBegin(dto.getDate()),
				ChartDate.getMonthEnd(dto.getDate()));
	}

	@Override
	public String createWeeklyCountSQL(DetailGenericDto dto) {
		return this.createCountSql(TableUtil.getMonthTable(dto.getDate()),
				dto, ChartDate.getWeekBegin(dto.getDate()),
				ChartDate.getWeekEnd(dto.getDate()));
	}
	
	private String createCountSql(String tableName, 
			DetailGenericDto dto, String begin, String end) {
		String field = "src_ip";
		int ipType = dto.getIpType();
		if (ipType == 2) {
			field = "dst_ip";
		}
		StringBuffer sql = new StringBuffer();
		sql.append("select count(1) as total_record  from ");
		sql.append(tableName);
		sql.append(" where ");
		sql.append(field);
		sql.append(" = '");
		sql.append(dto.getIpAddress());
		sql.append("' and log_time between '");
		sql.append(begin);
		sql.append("' and '");
		sql.append(end);
		sql.append("'");
		return sql.toString();
	}
}
