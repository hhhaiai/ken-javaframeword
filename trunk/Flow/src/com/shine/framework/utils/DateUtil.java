package com.shine.framework.utils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;

/**
 * 日期工具类
 */
public final class DateUtil {
	/** 日期格式 */
	public static final String TIME_PATTERN_DEFAULT = "yyyy-MM-dd HH:mm:ss";  
    public static final String DATE_PATTERN_DEFAULT = "yyyy-MM-dd";
    public static final String HOUR_PATTERN_DEFAULT = "HH:mm:ss";
    public static final String DATE_PATTERN_COMPACT = "yyyyMMdd";
	
	/** 当前日期 */
	private static Date currentDate = new Date();
	
	private DateUtil() {
	}

	/**
	 * 获取当前日期
	 * 
	 * @return 当前日期
	 */
	public static Date getCurrentDate() {
		return DateUtil.currentDate;
	}
	
	/**
	 * 获取当前日期开始时间
	 * 
	 * @return 当前日期开始时间
	 */
	public static Date getDateBegin() {
        return DateUtil.getDateBegin(DateUtil.currentDate);
    }
	
	/**
	 * 获取指定日期开始时间
	 * 
	 * @param  date 日期
	 * @return 指定日期开始时间
	 */
	public static Date getDateBegin(Date date) {
        Calendar calendar = Calendar.getInstance();  
        calendar.setTime(DateUtil.currentDate);
        calendar.set(calendar.get(Calendar.YEAR), calendar.get(Calendar.MONTH), 
        		calendar.get(Calendar.DAY_OF_MONTH), 0, 0, 0);  
        return calendar.getTime();
    }
	
	/**
	 * 获取当前日期结束时间
	 * 
	 * @return 当前日期结束时间
	 */
	public static Date getDateEnd() {
        return DateUtil.getDateEnd(DateUtil.currentDate);  
    }
	
	/**
	 * 获取指定日期结束时间
	 * 
	 * @param  date 日期
	 * @return 指定日期结束时间
	 */
	public static Date getDateEnd(Date date) {
        Calendar calendar = Calendar.getInstance();  
        calendar.setTime(date);
        calendar.set(calendar.get(Calendar.YEAR), calendar.get(Calendar.MONTH),
        		calendar.get(Calendar.DAY_OF_MONTH) + 1, 0, 0, 0);
        calendar.set(Calendar.SECOND, calendar.get(Calendar.SECOND) - 1);  
        return calendar.getTime();
    }
	
	/**
	 * 获取当月开始日期
	 * 
	 * @return 当月开始日期
	 */
	public static Date getMonthBegin() {
        return DateUtil.getMonthBegin(DateUtil.currentDate);
    }
	
	/**
	 * 获取指定日期所在月份的开始日期
	 * 
	 * @param  date 日期
	 * @return 指定月份开始日期
	 */
	public static Date getMonthBegin(Date date) {
        Calendar calendar = Calendar.getInstance();  
        calendar.setTime(date);
        calendar.set(calendar.get(Calendar.YEAR), 
        		calendar.get(Calendar.MONTH), 1, 0, 0, 0);  
        return calendar.getTime();
    }

	/**
	 * 获取当月结束日期
	 * 
	 * @return 当月结束日期
	 */
	public static Date getMonthEnd() {
        return DateUtil.getMonthEnd(DateUtil.currentDate);  
    }
	
	/**
	 * 获取指定日期所在月份的结束日期
	 * 
	 * @return 当月结束日期
	 */
	public static Date getMonthEnd(Date date) {
        Calendar calendar = Calendar.getInstance();  
        calendar.setTime(date);
        calendar.set(calendar.get(Calendar.YEAR), 
        		calendar.get(Calendar.MONTH) + 1, 1, 0, 0, 0);
        calendar.set(Calendar.SECOND, calendar.get(Calendar.SECOND) - 1);
        return calendar.getTime();  
    }
	
	/**
	 * 将当前日期格式化成字符串
	 * 
	 * @param  format 转换格式
	 * @return 日期字符串
	 */
	public static String dateToString(String format) {
		SimpleDateFormat dateFormat = new SimpleDateFormat(format);
		return dateFormat.format(DateUtil.currentDate);
	}
	
	/**
	 * 将指定日期格式化成字符串
	 * 
	 * @param  date   日期
	 * @param  format 转换格式
	 * @return 日期字符串
	 */
	public static String dateToString(Date date, String format) {
		SimpleDateFormat dateFormat = new SimpleDateFormat(format);
		return dateFormat.format(date);
	}
	
	/**
	 * 将字符串转换成日期
	 * 
	 * @param  dateString 日期字符串
	 * @param  format 	      转换格式
	 * @return 日期
	 */
	public static Date stringToDate(String dateString, String format) {
		SimpleDateFormat dateFormat = new SimpleDateFormat(format);
		Date date = null;
		try {
			date = dateFormat.parse(dateString);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return date;
	}
	
	/**
	 * 将时间戳转换成日期
	 * 
	 * @param  timeStamp 时间戳
	 * @return
	 */
	public static Date timeStampToDate(long timeStamp) {
		return new Date(timeStamp);
	}
	
	/**
	 * 日期转换成时间戳
	 * 
	 * @param  date 日期
	 * @return 时间戳
	 */
	public static Long DateToTimeStamp(Date date) {
		return date.getTime();
	}
	
	/**
	 * 将字符串转换成日期
	 * 
	 * @param  dateString 日期字符串
	 * @return 日期
	 */
	public static Date stringToDate(String dateString) {
		SimpleDateFormat dateFormat = new SimpleDateFormat(DateUtil.TIME_PATTERN_DEFAULT);
		Date date = null;
		try {
			date = dateFormat.parse(dateString);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return date;
	}
	
	/**
	 * 获取当前日期的普通格式(如:2011-08-09)
	 * 
	 * @return 当前日期的普通格式
	 */
	public static String getDetailDate() {
		return DateUtil.dateToString(DateUtil.DATE_PATTERN_DEFAULT);
	}
	
	/**
	 * 获取当前日期的普通格式(如:2011-08-09)
	 * 
	 * @param  Date 日期
	 * @return 当前日期的普通格式
	 */
	public static String getDetailDate(Date date) {
		return DateUtil.dateToString(date, DateUtil.DATE_PATTERN_DEFAULT);
	}
	
	/**
	 * 获取当前日期的详细格式(如:2011-08-09 08:08:08)
	 * 
	 * @return 当前日期的详细格式
	 */
	public static String getDetailTime() {
		return DateUtil.dateToString(DateUtil.TIME_PATTERN_DEFAULT);
	}
	
	/**
	 * 获取当前日期的详细格式(如:2011-08-09 08:08:08)
	 * 
	 * @param  date 日期
	 * @return 当前日期的详细格式
	 */
	public static String getDetailTime(Date date) {
		return DateUtil.dateToString(date, DateUtil.TIME_PATTERN_DEFAULT);
	}
	
	/**
	 * 获取当前时间格式(如:08:08:08)
	 * 
	 * @param  date 日期
	 * @return 当前日期的紧凑格式
	 */
	public static String getDetailHour() {
		return DateUtil.dateToString(DateUtil.HOUR_PATTERN_DEFAULT);
	}
	
	/**
	 * 获取当前日期的紧凑格式(如:20110809)
	 * 
	 * @return 当前日期的紧凑格式
	 */
	public static String getCompactDate() {
		return DateUtil.dateToString(DateUtil.DATE_PATTERN_COMPACT);
	}
	
	/**
	 * 获取指定日期的紧凑格式(如:20110809)
	 * 
	 * @param  date 日期
	 * @return 当前日期的紧凑格式
	 */
	public static String getCompactDate(Date date) {
		return DateUtil.dateToString(date, DateUtil.DATE_PATTERN_COMPACT);
	}
	
	/**
     * 获取当前年份 
     * 
     * @return 当前年份 
     */
    public static int getCurrentYear() {
        return Calendar.getInstance().get(Calendar.YEAR);  
    }
    
    /**
     * 获取当前月份
     *  
     * @return 当前月份
     */  
    public static int getCurrentMonth() {  
        return Calendar.getInstance().get(Calendar.MONTH) + 1;  
    }
    
    /**
     * 获取当前小时
     * 
     * @return 当前时间
     */
    public static int getCurrentHour() {  
    	return Calendar.getInstance().get(Calendar.HOUR_OF_DAY);
    }
    
    /**
	 * 获取当前的分钟
	 * 
	 * @return 当前的分钟
	 */
	public static int getCurrentMinute() {
		return Calendar.getInstance().get(Calendar.MINUTE);
	}
	
	/**
	 * 获取当天日期的前一天
	 * 
	 * @return 前天日期
	 */
	public static Date getPreviousDate() {
		return DateUtil.getIntervalOfDate(-1);
	}
	
	/**
	 * 获取当天日期的后一天
	 * 
	 * @return 后天日期
	 */
	public static Date getNextDate() {
		return DateUtil.getIntervalOfDate(1);
	}
	
	/**
	 * 获取距离当天日期间隔的日期
	 * 
	 * @param  interval 间隔日期(正数为向前推算,负数为向后推算)
	 * @return 距离当天日期间隔的日期
	 */
	public static Date getIntervalOfDate(int interval) {
		return DateUtil.getIntervalOfDate(DateUtil.currentDate, interval);
	}
	
	/**
	 * 获取距离指定日期间隔的日期
	 * 
	 * @param  date     日期
	 * @param  interval 间隔日期(正数为向前推算,负数为向后推算)
	 * @return 距离指定日期间隔的日期
	 */
	public static Date getIntervalOfDate(Date date, int interval) {
		GregorianCalendar calendar = new GregorianCalendar();
		calendar.setTime(date);
		calendar.add(GregorianCalendar.DATE, interval);
		return calendar.getTime();
	}
}
