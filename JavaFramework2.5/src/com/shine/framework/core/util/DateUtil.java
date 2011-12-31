package com.shine.framework.core.util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;


/**
 * 时间处理工具
 * 
 * @author warcrafthero
 * 
 */
public class DateUtil {
	/**
	 * 以<code>format</code>解析<code>dateString</code>产生日期
	 * 
	 * @param dateString
	 * @param format
	 * @return
	 */
	public static Date getDate(String dateString, String format) {
		try {
			SimpleDateFormat df = new SimpleDateFormat(format);
			return df.parse(dateString);
		} catch (Exception ex) {
			return null;
		}
	}

	/**
	 * 以<code>format</code>格式把<code>date</code>转换成字符串
	 * 
	 * @param date
	 * @param format
	 * @return
	 */
	public static String getDateString(Date date, String format) {
		SimpleDateFormat timeFormatter = new SimpleDateFormat(format);
		String dateString = timeFormatter.format(date);
		return dateString;
	}

	/**
	 * 秒数转换成当前时间字符串，形如yyyy-MM-dd HH:mm:ss
	 * 
	 * @param timeLong
	 *            离January 1, 1970, 00:00:00 GMT的秒数
	 * @return 当前时间字符串
	 */
	public static String longToTime(long timeLong) {
		Date date = new Date(timeLong * 1000);
		return getDateString(date, "yyyy-MM-dd HH:mm:ss");
	}

	/**
	 * 把一个形如"yyyy-mm-dd hh24:mi:ss"时间型转换成离January 1, 1970, 00:00:00 GMT的秒数
	 * 
	 * @param dateTime
	 * @return <code>dateTime</code>离January 1, 1970, 00:00:00 GMT的秒数
	 */
	public static long dateTimeToLong(String dateTime) {
		try {
			SimpleDateFormat dateFormat = new java.text.SimpleDateFormat(
					"yyyy-MM-dd HH:mm:ss");
			Date date = dateFormat.parse(dateTime);
			return date.getTime() / 1000;
		} catch (ParseException e) {
			// SysLogger.error(SysUtil.class, e);
			return 0;
		}
	}

	/**
	 * 计算出HH:mm:ss的距离00:00:00的秒数
	 * 
	 * @param time
	 *            格式如：HH:mm:ss
	 * @return
	 */
	public static long timeToLong(String time) {
		String date = getCurrentDate();
		String dateTime = date + " " + time;
		return dateTimeToLong(dateTime) - dateToLong(date);
	}

	/**
	 * 把一个形如"yyyy-MM-dd"日期型转换成一个长整数
	 */
	public static long dateToLong(String date) {
		return getDate(date, "yyyy-MM-dd").getTime() / 1000;
	}

	/**
	 * 年<code>year</code>月<code>month</code>具有的天数
	 * 
	 * @param year
	 * @param month
	 * @return
	 */
	public static int getDayNumOfMonth(int year, int month) {
		Calendar calendar = Calendar.getInstance();
		calendar.set(Calendar.YEAR, year);
		calendar.set(Calendar.MONTH, month);
		calendar.set(Calendar.DAY_OF_MONTH, 0);
		return calendar.get(Calendar.DAY_OF_MONTH);
	}

	/**
	 * 获取与时间<code>dateTime</code>距离<code>second</code>秒的时间 dateTime形如yyyy-MM-dd
	 * HH:mm:ss
	 * 
	 * @param dateTime
	 * @param second
	 * @return
	 */
	public static String calculateDateTime(String dateTime, int second) {
		return longToTime(dateTimeToLong(dateTime) + second);
	}

	/**
	 * 判断今天是否这个月的最后一天
	 * 
	 * @return
	 */
	public static boolean isTodayLastOfMonth() {
		return getCurrentDayOfMonth() == getDayNumOfMonth(getCurrentYear(),
				getCurrentMonth());
	}

	/**
	 * 当前日期是几号
	 * 
	 * @return
	 */
	public static int getCurrentDayOfMonth() {
		return Calendar.getInstance().get(Calendar.DAY_OF_MONTH);
	}

	/**
	 * 获取<code>startTime</code>和<code>endTime</code>之前的月列表
	 * <code>startTime</code>和<code>endTime</code>的格式以yyyy-MM开头
	 * 
	 * @param startTime
	 * @param endTime
	 * @param format
	 *            返回的列表每项的格式
	 * @return
	 * @throws Exception
	 */
	public static List<String> getAllMonthBetween(String startTime,
			String endTime, String format) {
		List<String> allMonth = new ArrayList<String>();
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM");
		Date startMonth = null;
		Date endMonth = null;
		try {
			startMonth = df.parse(startTime);
			endMonth = df.parse(endTime);
			Calendar cal = Calendar.getInstance();
			cal.setTime(startMonth);
			while (!cal.getTime().after(endMonth)) {
				allMonth.add(getDateString(cal.getTime(), "yyyyMM"));
				cal.add(Calendar.MONDAY, 1);
			}
			return allMonth;
		} catch (Exception e) {
			// SysLogger.error(SysUtil.class, e);
			return null;
		}

	}

	/**
	 * 根据<code>day</code>获取星期中文名，day==1时星期一
	 * 
	 * @param day
	 * @return
	 */
	public static String getWeekDay(int day) {
		if (day == 1)
			return "星期一";
		else if (day == 2)
			return "星期二";
		else if (day == 3)
			return "星期三";
		else if (day == 4)
			return "星期四";
		else if (day == 5)
			return "星期五";
		else if (day == 6)
			return "星期六";
		else
			return "星期天";
	}

	/**
	 * 得到当前日期字符串，形如：yyyy-MM-dd
	 */
	public static String getCurrentDate() {
		return getDateString(new Date(), "yyyy-MM-dd");
	}

	/**
	 * 获取凌晨时间
	 * 
	 * @return
	 */
	public static String getWeeHours() {
		return "00:00:00";
	}

	/**
	 * 得到当前时间yyyy-MM-dd HH:mm:ss
	 */
	public static String getCurrentDateTime() {
		return getDateString(new Date(), "yyyy-MM-dd HH:mm:ss");
	}
	
	/**
	 * 得到当前时间yyyyMMdd
	 */
	public static String getCurrentDateAsId() {
		return getDateString(new Date(), "yyyyMMdd");
	}

	/**
	 * 得到当前时间yyyyMMddHHmmss
	 */
	public static String getCurrentDateTimeAsId() {
		return getDateString(new Date(), "yyyyMMddHHmmss");
	}

	/**
	 * 得到当前时间yyyyMMddHHmmssSSS
	 */
	public static String getCurrentDateTimeDetailAsId() {
		return getDateString(new Date(), "yyyyMMddHHmmssSSS");
	}

	/**
	 * 得到当前时间HH:mm:ss
	 * 
	 * @return
	 */
	public static String getCurrentTime() {
		return getDateString(new Date(), "HH:mm:ss");
	}

	/**
	 * 得到当前时间yyyy-MM-dd HH:mm:ssSSS
	 * 
	 * @return
	 */
	public static String getCurrentTime2() {
		return getDateString(new Date(), "yyyy-MM-dd HH:mm:ssSSS");
	}

	/**
	 * 计算出当前时间HH:mm:ss距离00:00:00的秒数
	 * 
	 * @return
	 */
	public static long getCurrentLongTime() {
		return timeToLong(getCurrentTime());
	}
	
	/**
	 * 
	 * @return 当前时间离January 1, 1970, 00:00:00 GMT的毫秒数
	 */
	public static long getCurrentLongDateTimeLong() {
		return (long) (new Date()).getTime();
	}

	/**
	 * 
	 * @return 当前时间离January 1, 1970, 00:00:00 GMT的秒数
	 */
	public static long getCurrentLongDateTime() {
		return (long) (new Date()).getTime() / 1000;
	}

	/**
	 * 得到当前年份
	 */
	public static int getCurrentYear() {
		return Calendar.getInstance().get(Calendar.YEAR);
	}

	/**
	 * 得到当前月份,不包括年
	 */
	public static int getCurrentMonth() {
		return Calendar.getInstance().get(Calendar.MONTH) + 1;
	}

	/**
	 * 得到当前小时
	 */
	public static int getCurrentHour() {
		Calendar cal = Calendar.getInstance();
		int curHour = cal.get(Calendar.HOUR_OF_DAY);
		return curHour;
	}

	/**
	 * 得到当前的分钟
	 * 
	 * @return
	 */
	public static int getCurrentMinute() {
		Calendar cal = Calendar.getInstance();
		int curMinute = cal.get(Calendar.MINUTE);
		return curMinute;
	}

	/**
	 * 获取当前时间的一个月后的时间
	 * 
	 * @return
	 */
	public static Date getNextMonth() {
		Calendar calendar = Calendar.getInstance();
		calendar.add(Calendar.MONTH, 1);
		return calendar.getTime();
	}

	/**
	 * 计算两个日期之间的天数
	 */
	public static int getDaysBetweenTwoDates(long beginDate, long endDate) {
		long result = 0;
		if (beginDate > endDate)
			result = (beginDate - endDate) / 86400;
		else
			result = (endDate - beginDate) / 86400;
		return (int) result;
	}

	/**
	 * 得到某天的日期 interval 距今天的天数
	 */
	public static String getDate(int interval) {
		Calendar cal = Calendar.getInstance();
		cal.add(Calendar.DATE, interval);
		String date = new java.sql.Date(cal.getTimeInMillis()).toString();
		return date;
	}

	/**
	 * 得到某天的日期 interval 距今天的天数
	 */
	public static String getDateFromToday(int interval) {
		Calendar cal = Calendar.getInstance();
		cal.add(Calendar.DATE, interval);
		String date = new java.sql.Date(cal.getTimeInMillis()).toString();
		return date;
	}

	/**
	 * 将秒数转换成时间字符串：如HH时MM分SS秒
	 * 
	 * @param second
	 * @return
	 */
	public static String secondToTimeString(long second) {
		StringBuffer timeStr = new StringBuffer(10);
		long hh24 = second / 3600;
		long surplus = second % 3600;

		long mi = surplus / 60;
		long ss = surplus % 60;

		if (hh24 > 0) {
			timeStr.append(hh24);
			timeStr.append("时");
		}

		if (mi > 0) {
			timeStr.append(mi);
			timeStr.append("分");
		}

		if (timeStr.length() == 0 || ss > 0) {
			timeStr.append(ss);
			timeStr.append("秒");
		}

		return timeStr.toString();
	}

	/**
	 * 计算两个时间点间的时间差
	 */
	public static String diffTwoTime(String time1, String time2) {
		if (time1 == null || time2 == null)
			return "";
		long diffTime = dateTimeToLong(time2) - dateTimeToLong(time1);
		return secondToTimeString(diffTime);
	}

	/**
	 * 计算两个时间点间的时间差
	 */
	public static long diffTwoTimeToLong(String time1, String time2) {
		if (time1 == null || time2 == null)
			return 0;
		return dateTimeToLong(time2) - dateTimeToLong(time1);
	}

	// public static String hexStringToDateTime(String hexString) {
	// String dateTime = "";
	// try {
	// byte[] values = OctetString.fromHexString(hexString).getValue();
	// int year, month, day, hour, minute;
	//
	// year = values[0] * 256 + 256 + values[1];
	// month = values[2];
	// day = values[3];
	// hour = values[4];
	// minute = values[5];
	//
	// char format_str[] = new char[22];
	// int index = 3;
	// int temp = year;
	// for (; index >= 0; index--) {
	// format_str[index] = (char) (48 + (temp - temp / 10 * 10));
	// temp /= 10;
	// }
	// format_str[4] = '-';
	// index = 6;
	// temp = month;
	// for (; index >= 5; index--) {
	// format_str[index] = (char) (48 + (temp - temp / 10 * 10));
	// temp /= 10;
	// }
	// format_str[7] = '-';
	// index = 9;
	// temp = day;
	// for (; index >= 8; index--) {
	// format_str[index] = (char) (48 + (temp - temp / 10 * 10));
	// temp /= 10;
	// }
	// format_str[10] = ' ';
	// index = 12;
	// temp = hour;
	// for (; index >= 11; index--) {
	// format_str[index] = (char) (48 + (temp - temp / 10 * 10));
	// temp /= 10;
	// }
	// format_str[13] = ':';
	// index = 15;
	// temp = minute;
	// for (; index >= 14; index--) {
	// format_str[index] = (char) (48 + (temp - temp / 10 * 10));
	// temp /= 10;
	// }
	// dateTime = new String(format_str,0,format_str.length).substring(0, 16);
	// } catch (Exception e) {
	// //SysLogger.error(e);
	// }
	// return dateTime;
	// }
}
