package com.shine.sourceflow.utils;

import com.shine.framework.utils.DateUtil;

/**
 * 报表日期工具类
 */
public class ChartDate {
	private ChartDate() {
	}
	
	/**
	 * 前一小时
	 * 
	 * @return
	 */
	public static String getPreHour() {
		return DateUtil.getDetailTime(DateUtil.getIntervalOfHour(-1));
	}
	
	/**
	 * 当前时间
	 * 
	 * @return
	 */
	public static String getCurDate() {
		return DateUtil.getDetailTime();
	}
	
	/**
	 * 早00:00:00
	 * 
	 * @param date
	 * @return
	 */
	public static String getDateBegin(String date) {
		return DateUtil.getDetailTime(DateUtil.getDateBegin(
				DateUtil.stringToDate(date, DateUtil.DATE_PATTERN_DEFAULT)));
	}
	
	/**
	 * 晚23:59:59
	 * 
	 * @param date
	 * @return
	 */
	public static String getDateEnd(String date) {
		return DateUtil.getDetailTime(DateUtil.getDateEnd(
				DateUtil.stringToDate(date, DateUtil.DATE_PATTERN_DEFAULT)));
	}
	
	/**
	 * 周一
	 * 
	 * @param date
	 * @return
	 */
	public static String getWeekBegin(String date) {
		return DateUtil.getDetailTime(DateUtil.getWeekBegin(
				DateUtil.stringToDate(date, DateUtil.DATE_PATTERN_DEFAULT)));
	}
	
	/**
	 * 周末
	 * 
	 * @param date
	 * @return
	 */
	public static String getWeekEnd(String date) {
		return DateUtil.getDetailTime(DateUtil.getWeekEnd(
				DateUtil.stringToDate(date, DateUtil.DATE_PATTERN_DEFAULT)));
	}
	
	/**
	 * 月首
	 * 
	 * @param date
	 * @return
	 */
	public static String getMonthBegin(String date) {
		return DateUtil.getDetailTime(DateUtil.getMonthBegin(
				DateUtil.stringToDate(date, DateUtil.DATE_PATTERN_DEFAULT)));
	}
	
	/**
	 * 月末
	 * 
	 * @param date
	 * @return
	 */
	public static String getMonthEnd(String date) {
		return DateUtil.getDetailTime(DateUtil.getMonthEnd(
				DateUtil.stringToDate(date, DateUtil.DATE_PATTERN_DEFAULT)));
	}
}
