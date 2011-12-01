package com.shine.sourceflow.dao.show.trend.strategy;

import java.text.DecimalFormat;
import java.util.Date;
import java.util.Map;
import java.util.TreeMap;

import javaf.framework.util.DateUtil;

import com.shine.framework.utils.TableUtil;
import com.shine.sourceflow.model.show.trend.TrendGenericDto;

public class SessionTrafficTrendStdQuery implements ITrendQueryStrategy {
	@Override
	public Map<String, String[]> createDailyCountSQL(TrendGenericDto dto) {
		String[] fields = new String[] {"a.src_ip", "a.dst_ip"};
		Map<String, String[]> result = new TreeMap<String, String[]>();
		DecimalFormat numFormat = new DecimalFormat("00");
		for (int i = 0; i < 24; i++) {
			String startTime = dto.getDate() + " " + numFormat.format(i) + ":00:00";
			String endTime = dto.getDate() + " " + numFormat.format(i) + ":59:59";
			String[] sqls = new String[2];
			for (int j = 0; j < 2; j++) {
				StringBuffer sql = new StringBuffer();
				sql.append("select b.session_alias, sum(a.bytes) as total_bytes from ");
				sql.append(TableUtil.getMonthTable(dto.getDate()));
				sql.append(" as a, session_config as b where a.log_time between '");
				sql.append(startTime);
				sql.append("' and '");
				sql.append(endTime);
				sql.append("' and ");
				sql.append(fields[j]);
				sql.append(" = b.first_ip or ");
				sql.append(fields[j]);
				sql.append(" = b.second_ip and a.log_time between '");
				sql.append(startTime);
				sql.append("' and '");
				sql.append(endTime);
				sql.append("' and b.session_id = '");
				sql.append(dto.getSessionId());
				sql.append("'");
				sqls[j] = sql.toString();
			}
			result.put(numFormat.format(i) + ":00:00", sqls);
		}
		return result;
	}

	@Override
	public Map<String, String[]> createHourlyCountSQL(TrendGenericDto dto) {
		return this.createDailyCountSQL(dto);
	}

	@Override
	public Map<String, String[]> createMonthlyCountSQL(TrendGenericDto dto) {
		String[] fields = new String[] {"a.src_ip", "a.dst_ip"};
		Map<String, String[]> result = new TreeMap<String, String[]>();
		Date date = DateUtil.getMonthBegin(
				DateUtil.stringToDate(dto.getDate(), DateUtil.DATE_PATTERN_DEFAULT));
		for (int i = 0; i < DateUtil.getDaysOfMonth(date); i++) {
			Date theDate = DateUtil.getIntervalOfDate(date, i);
			String time = DateUtil.dateToString(theDate, DateUtil.DATE_PATTERN_DEFAULT);
			String[] sqls = new String[2];
			for (int j = 0; j < 2; j++) {
				StringBuffer sql = new StringBuffer();
				sql.append("select b.session_alias, sum(a.bytes) as total_bytes from ");
				sql.append(TableUtil.getMonthTable(dto.getDate()));
				sql.append(" as a, session_config as b where a.log_time like '");
				sql.append(time);
				sql.append("%' and ");
				sql.append(fields[j]);
				sql.append(" = b.first_ip or ");
				sql.append(fields[j]);
				sql.append(" = b.second_ip and a.log_time like '");
				sql.append(time);
				sql.append("%' and b.session_id = '");
				sql.append(dto.getSessionId());
				sql.append("'");
				sqls[j] = sql.toString();
			}
			result.put(DateUtil.dateToString(theDate, DateUtil.DATE_PATTERN_DEFAULT), sqls);
		}
		return result;
	}

	@Override
	public Map<String, String[]> createWeeklyCountSQL(TrendGenericDto dto) {
		String[] fields = new String[] {"a.src_ip", "a.dst_ip"};
		Map<String, String[]> result = new TreeMap<String, String[]>();
		Date date = DateUtil.getWeekBegin(DateUtil.stringToDate(
				dto.getDate(), DateUtil.DATE_PATTERN_DEFAULT));
		for (int i = 1; i <= 7; i++) {
			Date theDate = DateUtil.getIntervalOfDate(date, i);
			String time = DateUtil.dateToString(
					theDate, DateUtil.DATE_PATTERN_DEFAULT);
			String[] sqls = new String[2];
			for (int j = 0; j < 2; j++) {
				StringBuffer sql = new StringBuffer();
				sql.append("select b.session_alias, sum(a.bytes) as total_bytes from ");
				sql.append(TableUtil.getMonthTable(dto.getDate()));
				sql.append(" as a, session_config as b where a.log_time like '");
				sql.append(time);
				sql.append("%' and ");
				sql.append(fields[j]);
				sql.append(" = b.first_ip or ");
				sql.append(fields[j]);
				sql.append(" = b.second_ip and a.log_time like '");
				sql.append(time);
				sql.append("%' and b.session_id = '");
				sql.append(dto.getSessionId());
				sql.append("'");
				sqls[j] = sql.toString();
			}
			result.put(time, sqls);
		}
		return result;
	}
}
