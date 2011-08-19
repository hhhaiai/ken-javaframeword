package com.shine.sourceflow.dao.show.strategy;

import java.util.Date;

import com.shine.framework.utils.DateUtil;
import com.shine.framework.utils.TableUtil;
import com.shine.sourceflow.model.show.GenericDTO;

/**
 * IP流量标准查询策略
 */
public class IPTrafficStdQueryStrategy implements IQueryStrategy {
	private static final String SQL_FIELD = "src_ip,dst_ip,sum(bytes) as total_bytes";
	private static final String SQL_ORDERBY = "";
	
	@Override
	public String createDailyQuerySQL(GenericDTO dto) {
		StringBuffer sql = new StringBuffer();
		sql.append("select ");
		sql.append(SQL_FIELD);
		sql.append(" from ");
		sql.append(TableUtil.getDateTable(dto.getDate()));
		sql.append(" group by src_ip ");
		sql.append(SQL_ORDERBY);
		sql.append(" limit 0, ");
		sql.append(dto.getTopPageN());
		return sql.toString();
	}

	@Override
	public String createHourlyQuerySQL(GenericDTO dto) {
		StringBuffer sql = new StringBuffer();
		if (this.isToday(dto.getDate())) {
			sql.append("select ");
			sql.append(SQL_FIELD);
			sql.append(" from ");
			sql.append(TableUtil.getCurrentHourTable());
			sql.append(" group by src_ip ");
			sql.append(SQL_ORDERBY);
			sql.append(" limit 0, ");
			sql.append(dto.getTopPageN());
		} else {
			sql.append("select ");
			sql.append(SQL_FIELD);
			sql.append(" from ");
			sql.append(TableUtil.getDateTable(dto.getDate()));
			sql.append(" group by src_ip ");
			sql.append(SQL_ORDERBY);
			sql.append(" limit 0, ");
			sql.append(dto.getTopPageN());
		}
		return sql.toString();
	}

	@Override
	public String createMonthlyQuerySQL(GenericDTO dto) {
		StringBuffer sql = new StringBuffer();
		sql.append("select ");
		sql.append(SQL_FIELD);
		sql.append(" from ");
		sql.append(TableUtil.getMonthTable(dto.getDate()));
		sql.append(" group by src_ip ");
		sql.append(SQL_ORDERBY);
		sql.append(" limit 0, ");
		sql.append(dto.getTopPageN());
		return sql.toString();
	}

	@Override
	public String createWeeklyQuerySQL(GenericDTO dto) {
		Date beginDate = DateUtil.getDateBegin(DateUtil.stringToDate((dto.getDate())));
		Date endDate = DateUtil.getDateEnd((DateUtil.stringToDate((dto.getDate()))));
		StringBuffer sql = new StringBuffer();
		sql.append("select ");
		sql.append(SQL_FIELD);
		sql.append(" from ");
		sql.append(TableUtil.getMonthTable(dto.getDate()));
		sql.append(" where log_time >= ");
		sql.append(DateUtil.getDetailTime(beginDate));
		sql.append(" and log_time <= ");
		sql.append(DateUtil.getDetailTime(endDate));
		sql.append(" group by src_ip ");
		sql.append(SQL_ORDERBY);
		sql.append(" limit 0, ");
		sql.append(dto.getTopPageN());
		return sql.toString();
	}
	
	/**
	 * 判断日期是否为今天
	 * 
	 * @param date
	 * @return
	 */
	private boolean isToday(String date) {
		return date.equals(DateUtil.getDetailDate());
	}
}
