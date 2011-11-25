package com.shine.sourceflow.dao.show.trend.strategy;

import java.text.DecimalFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javaf.framework.util.DateUtil;

import com.shine.framework.utils.TableUtil;
import com.shine.sourceflow.model.show.trend.TrendGenericDto;

public class IPTrafficTrendStdQuery implements ITrendQueryStrategy {
	@Override
	public Map<String, String[]> createDailyCountSQL(TrendGenericDto dto) {
		return this.createHourlyCountSQL(dto);
	}

	@Override
	public Map<String, String[]> createHourlyCountSQL(TrendGenericDto dto) {
		Map<String, String[]> result = new HashMap<String, String[]>();
		int ipType = dto.getIpType();
		String field = "src_ip";
		if (ipType == 2) {
			field = "dst_ip";
		}
		DecimalFormat numFormat = new DecimalFormat("00");
		for (int i = 0; i < 24; i++) {
			String startTime = dto.getDate() + " " + numFormat.format(i) + ":00:00";
			String endTime = dto.getDate() + " " + numFormat.format(i) + ":59:59";
			StringBuffer sql = new StringBuffer();
			sql.append("select ");
			sql.append(field);
			sql.append(", sum(bytes) as total_bytes from ");
			sql.append(TableUtil.getMonthTable(dto.getDate()));
			sql.append(" where log_time between '");
			sql.append(startTime);
			sql.append("' and '");
			sql.append(endTime);
			sql.append("' and ");
			sql.append(field);
			sql.append("='");
			sql.append(dto.getIpAddress());
			sql.append("' group by ");
			sql.append(field);
			result.put(numFormat.format(i) + ":00:00", new String[] {sql.toString()});
		}
		return result;
	}

	@Override
	public Map<String, String[]> createMonthlyCountSQL(TrendGenericDto dto) {
		Map<String, String[]> result = new HashMap<String, String[]>();
		int ipType = dto.getIpType();
		String field = "src_ip";
		if (ipType == 2) {
			field = "dst_ip";
		}
		Date date = DateUtil.getMonthBegin(
				DateUtil.stringToDate(dto.getDate(), DateUtil.DATE_PATTERN_DEFAULT));
		for (int i = 0; i < DateUtil.getDaysOfMonth(date); i++) {
			Date theDate = DateUtil.getIntervalOfDate(date, i);
			String startTime = DateUtil.dateToString(DateUtil.
					getDateBegin(theDate), DateUtil.TIME_PATTERN_DEFAULT);
			String endTime = DateUtil.dateToString(DateUtil.
					getDateEnd(theDate), DateUtil.TIME_PATTERN_DEFAULT);
			StringBuffer sql = new StringBuffer();
			sql.append("select ");
			sql.append(field);
			sql.append(", sum(bytes) as total_bytes from ");
			sql.append(TableUtil.getMonthTable(dto.getDate()));
			sql.append(" where log_time between '");
			sql.append(startTime);
			sql.append("' and '");
			sql.append(endTime);
			sql.append("' and ");
			sql.append(field);
			sql.append("='");
			sql.append(dto.getIpAddress());
			sql.append("' group by '");
			sql.append(field);
			sql.append("'");
			result.put(DateUtil.dateToString(theDate, 
					DateUtil.DATE_PATTERN_DEFAULT), new String[] {sql.toString()});
		}
		return result;
	}

	@Override
	public Map<String, String[]> createWeeklyCountSQL(TrendGenericDto dto) {
		Map<String, String[]> result = new HashMap<String, String[]>();
		int ipType = dto.getIpType();
		String field = "src_ip";
		if (ipType == 2) {
			field = "dst_ip";
		}
		Date date = DateUtil.getWeekBegin(DateUtil.stringToDate(
				dto.getDate(), DateUtil.DATE_PATTERN_DEFAULT));
		for (int i = 1; i <= 7; i++) {
			Date theDate = DateUtil.getIntervalOfDate(date, i);
			String time = DateUtil.dateToString(
					theDate, DateUtil.DATE_PATTERN_DEFAULT);
			StringBuffer sql = new StringBuffer();
			sql.append("select ");
			sql.append(field);
			sql.append(", sum(bytes) as total_bytes from ");
			sql.append(TableUtil.getMonthTable(dto.getDate()));
			sql.append(" where log_time like '");
			sql.append(time);
			sql.append("%' and ");
			sql.append(field);
			sql.append(" = '");
			sql.append(dto.getIpAddress());
			sql.append("' group by ");
			sql.append(field);
			result.put(time, new String[] {sql.toString()});
		}
		return result;
	}
}
