package com.shine.framework.utils;

import java.text.DecimalFormat;

/**
 * 数据表操作工具类
 */
public class TableUtil {
	private TableUtil() {
	}

	/**
	 * 获取当前小时的表名
	 * 
	 * @return
	 */
	public static String getCurrentHourTable() {
		return "rawnetflow_hour_"
				+ new DecimalFormat("00").format(DateUtil.getCurrentHour());
	}

	/**
	 * 获取今天日期的表名
	 * 
	 * @return
	 */
	public static String getTodayTable() {
		return "rawnetflow_date_" + DateUtil.getCompactDate();
	}

	/**
	 * 获取明天日期的表名
	 * 
	 * @return
	 */
	public static String getTomorrowTable() {
		return "rawnetflow_date_"
				+ DateUtil.getCompactDate(DateUtil.getNextDate());
	}

	/**
	 * 获取当前月份的表名
	 * 
	 * @return
	 */
	public static String getCurrentMonthTable() {
		return "rawnetflow_month_" + DateUtil.getCompactMonth();
	}

	/**
	 * 获取下一个月份的表名
	 * 
	 * @return
	 */
	public static String getNextMonthTable() {
		return "rawnetflow_month_"
				+ DateUtil.getCompactMonth(DateUtil.getNextMonth());
	}

	/**
	 * 将日期字符串转换成日期表
	 * 
	 * @param dateString
	 * @return
	 */
	public static String getDateTable(String dateString) {
		return "rawnetflow_date_"
				+ DateUtil.getCompactDate(DateUtil.stringToDate(dateString, DateUtil.DATE_PATTERN_DEFAULT));
	}
	
	/**
	 * 将日期字符串转换成月份表
	 * 
	 * @param dateString
	 * @return
	 */
	public static String getMonthTable(String dateString) {
		return "rawnetflow_month_"
			+ DateUtil.getCompactMonth(DateUtil.stringToDate(dateString, DateUtil.DATE_PATTERN_DEFAULT));
	}
}
