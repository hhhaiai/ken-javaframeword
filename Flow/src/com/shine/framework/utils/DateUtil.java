package com.shine.framework.utils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

/**
 * 日期工具类
 */
public final class DateUtil {
	/** 各星期 */
	public static final int SUNDAY 		= 1;
    public static final int MONDAY 		= 2;
    public static final int TUESDAY 	= 3;
    public static final int WEDNESDAY 	= 4;
    public static final int THURSDAY 	= 5;
    public static final int FRIDAY 		= 6;
    public static final int SATURDAY 	= 7;
    
    /** 各月份 */
    public final static int JANUARY 	= 0;
    public final static int FEBRUARY 	= 1;
    public final static int MARCH 		= 2;
    public final static int APRIL		= 3;
    public final static int MAY 		= 4;
    public final static int JUNE 		= 5;
    public final static int JULY 		= 6;
    public final static int AUGUST 		= 7;
    public final static int SEPTEMBER 	= 8;
    public final static int OCTOBER 	= 9;
    public final static int NOVEMBER 	= 10;
    public final static int DECEMBER 	= 11;
	
	/** 日期格式 */
	public static final String TIME_PATTERN_DEFAULT 	= "yyyy-MM-dd HH:mm:ss";  
    public static final String DATE_PATTERN_DEFAULT 	= "yyyy-MM-dd";
    public static final String HOUR_PATTERN_DEFAULT 	= "HH:mm:ss";
    public static final String DATE_PATTERN_COMPACT 	= "yyyyMMdd";
    public static final String MONTH_PATTERN_COMPACT 	= "yyyyMM";
	
	private DateUtil() {
	}
	
	/**
	 * 测试入口
	 * 
	 * @param args
	 */
	public static void main(String[] args) {
		System.out.println(DateUtil.getCurrentDate());
	}

	/**
	 * 获取当前日期
	 * 
	 * @return 当前日期
	 */
	public static Date getCurrentDate() {
		return new Date();
	}
	
	/**
	 * 获取今天某时某分某秒所属的日期
	 * 
	 * @param  hour   时
	 * @param  minute 分
	 * @param  second 秒
	 * @return 所属日期
	 */
	public static Date getTodayAt(int hour, int minute, int second) {
		return DateUtil.getDateAt(
				DateUtil.getCurrentDate(), hour, minute, second);
	}
	
	/**
	 * 获取明天某时某分某秒所属的日期
	 * 
	 * @param  hour   时
	 * @param  minute 分
	 * @param  second 秒
	 * @return 所属日期
	 */
	public static Date getTomorrowAt(int hour, int minute, int second) {
		Date tomorrow = DateUtil.tomorrow();
		return DateUtil.getDateAt(tomorrow, hour, minute, second);
	}
	
	/**
	 * 获取昨天某时某分某秒所属的日期
	 * 
	 * @param  hour   时
	 * @param  minute 分
	 * @param  second 秒
	 * @return 所属日期
	 */
	public static Date getYesterdayAt(int hour, int minute, int second) {
		Date tomorrow = DateUtil.yesterday();
		return DateUtil.getDateAt(tomorrow, hour, minute, second);
	}
	
	/**
	 * 获取某个日期某时某分某秒所属的日期
	 *
	 * @param  date   日期
	 * @param  hour   时
	 * @param  minute 分
	 * @param  second 秒
	 * @return 所属日期
	 */
	public static Date getDateAt(Date date, int hour, int minute, int second) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.set(Calendar.HOUR_OF_DAY, hour);
        calendar.set(Calendar.MINUTE, minute);
        calendar.set(Calendar.SECOND, second);
        calendar.set(Calendar.MILLISECOND, 0);
        return calendar.getTime();
	}
	
	/**
	 * 获取当前日期开始时间
	 * 
	 * @return 当前日期开始时间
	 */
	public static Date getDateBegin() {
        return DateUtil.getDateBegin(DateUtil.getCurrentDate());
    }
	
	/**
	 * 获取指定日期开始时间
	 * 
	 * @param  date 日期
	 * @return 指定日期开始时间
	 */
	public static Date getDateBegin(Date date) {
        Calendar calendar = Calendar.getInstance();  
        calendar.setTime(date);
        calendar.set(calendar.get(Calendar.YEAR), calendar.get(Calendar.MONTH), 
        		calendar.get(Calendar.DAY_OF_MONTH), 0, 0, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        return calendar.getTime();
    }
	
	/**
	 * 获取当前日期结束时间
	 * 
	 * @return 当前日期结束时间
	 */
	public static Date getDateEnd() {
        return DateUtil.getDateEnd(DateUtil.getCurrentDate());  
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
        calendar.set(Calendar.MILLISECOND, 0);
        return calendar.getTime();
    }
	
	/**
	 * 获取本周开始日期
	 * 
	 * @return 本周开始日期
	 */
	public static Date getWeekBegin() {
		return DateUtil.getWeekBegin(DateUtil.getCurrentDate());
	}
	
	/**
	 * 根据指定日期获取该周开始日期
	 * 
	 * @param  date 日期
	 * @return 该周开始日期
	 */
	public static Date getWeekBegin(Date date) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		int dayOfWeek = calendar.get(Calendar.DAY_OF_WEEK);
		calendar.add(Calendar.DAY_OF_MONTH, -dayOfWeek);
		calendar.add(Calendar.DAY_OF_MONTH, SUNDAY);
		calendar.set(calendar.get(Calendar.YEAR), calendar.get(Calendar.MONTH), 
        		calendar.get(Calendar.DAY_OF_MONTH), 0, 0, 0);
		calendar.set(Calendar.MILLISECOND, 0);
		return calendar.getTime();
	}
	
	/**
	 * 获取本周结束日期
	 * 
	 * @return 本周结束日期
	 */
	public static Date getWeekEnd() {
		return DateUtil.getWeekEnd(DateUtil.getCurrentDate());
	}
	
	/**
	 * 根据指定日期获取该周结束日期
	 * 
	 * @param  date 日期
	 * @return 该周结束日期
	 */
	public static Date getWeekEnd(Date date) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		int dayOfWeek = calendar.get(Calendar.DAY_OF_WEEK);
		calendar.add(Calendar.DAY_OF_MONTH, -dayOfWeek);
		calendar.add(Calendar.DAY_OF_MONTH, SATURDAY);
		calendar.set(calendar.get(Calendar.YEAR), calendar.get(Calendar.MONTH),
        		calendar.get(Calendar.DAY_OF_MONTH) + 1, 0, 0, 0);
        calendar.set(Calendar.SECOND, calendar.get(Calendar.SECOND) - 1);
        calendar.set(Calendar.MILLISECOND, 0);
        return calendar.getTime();
	}
	
	/**
	 * 获取当月开始日期
	 * 
	 * @return 当月开始日期
	 */
	public static Date getMonthBegin() {
        return DateUtil.getMonthBegin(DateUtil.getCurrentDate());
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
        calendar.set(Calendar.MILLISECOND, 0);
        return calendar.getTime();
    }

	/**
	 * 获取当月结束日期
	 * 
	 * @return 当月结束日期
	 */
	public static Date getMonthEnd() {
        return DateUtil.getMonthEnd(DateUtil.getCurrentDate());  
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
        calendar.set(Calendar.MILLISECOND, 0);
        return calendar.getTime();  
    }
	
	/**
	 * 获取该年开始日期
	 * 
	 * @return 该年开始日期
	 */
	public static Date getYearBegin() {
        return DateUtil.getYearBegin(DateUtil.getCurrentDate());  
    }
	
	/**
	 * 获取指定日期所在年份的开始日期
	 * 
	 * @param  date 日期
	 * @return 指定年份开始日期
	 */
	public static Date getYearBegin(Date date) {
        Calendar calendar = Calendar.getInstance();  
        calendar.setTime(date);
        calendar.set(calendar.get(Calendar.YEAR), 
        		Calendar.JANUARY, 1, 0, 0, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        return calendar.getTime();
    }
	
	/**
	 * 获取该年结束日期
	 * 
	 * @return 该年结束日期
	 */
	public static Date getYearEnd() {
        return DateUtil.getYearEnd(DateUtil.getCurrentDate());  
    }
	
	/**
	 * 获取指定日期所在年份的结束日期
	 * 
	 * @param  date 日期
	 * @return 指定年份结束日期
	 */
	public static Date getYearEnd(Date date) {
        Calendar calendar = Calendar.getInstance();  
        calendar.setTime(date);
        calendar.set(calendar.get(Calendar.YEAR) + 1,
        		Calendar.JANUARY, 1, 0, 0, 0);
        calendar.set(Calendar.SECOND, calendar.get(Calendar.SECOND) - 1);
        calendar.set(Calendar.MILLISECOND, 0);
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
		return dateFormat.format(DateUtil.getCurrentDate());
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
	 * @return 日期
	 */
	public static Date stringToDate(String dateString) {
		return DateUtil.stringToDate(dateString, DateUtil.TIME_PATTERN_DEFAULT);
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
	 * 获取当前月份的紧凑格式(如:201108)
	 * 
	 * @return 当前月份的紧凑格式
	 */
	public static String getCompactMonth() {
		return DateUtil.dateToString(DateUtil.MONTH_PATTERN_COMPACT);
	}
	
	/**
	 * 获取指定日期所在月份的紧凑格式(如:20110809)
	 * 
	 * @param  date 日期
	 * @return 指定日期所在月份的紧凑格式
	 */
	public static String getCompactMonth(Date date) {
		return DateUtil.dateToString(date, DateUtil.MONTH_PATTERN_COMPACT);
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
	 * 获取当天日期的前一天(昨天)
	 * 
	 * @return 前天日期
	 */
	public static Date yesterday() {
		return DateUtil.getIntervalOfDate(-1);
	}
	
	/**
	 * 获取当天日期的后一天(明天)
	 * 
	 * @return 后天日期
	 */
	public static Date tomorrow() {
		return DateUtil.getIntervalOfDate(1);
	}
	
	/**
	 * 获取前一个月份的日期
	 * 
	 * @return 前个月份的日期
	 */
	public static Date getPreviousMonth() {
		return DateUtil.getIntervalOfMonth(-1);
	}
	
	/**
	 * 获取后一个月份的日期
	 * 
	 * @return 后一个月份的日期
	 */
	public static Date getNextMonth() {
		return DateUtil.getIntervalOfMonth(1);
	}
	
	/**
	 * 获取距离当天<code>interval</code>小时的日期
	 * 
	 * @param  interval 间隔小时数
	 * @return
	 */
	public static Date getIntervalOfHour(int interval) {
		return DateUtil.getIntervalOfHour(DateUtil.getCurrentDate(), interval);
	}
	
	/**
	 * 获取距离指定日期<code>interval</code>小时的日期
	 * 
	 * @param  date     日期
	 * @param  interval 间隔小时数
	 * @return
	 */
	public static Date getIntervalOfHour(Date date, int interval) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		calendar.add(Calendar.HOUR, interval);
		return calendar.getTime();
	}
	
	/**
	 * 获取距离当天日期间隔的日期
	 * 
	 * @param  interval 间隔日期(正数为向前推算,负数为向后推算)
	 * @return 距离当天日期间隔的日期
	 */
	public static Date getIntervalOfDate(int interval) {
		return DateUtil.getIntervalOfDate(DateUtil.getCurrentDate(), interval);
	}
	
	/**
	 * 获取距离指定日期间隔的日期
	 * 
	 * @param  date     日期
	 * @param  interval 间隔日期(正数为向前推算,负数为向后推算)
	 * @return 距离指定日期间隔的日期
	 */
	public static Date getIntervalOfDate(Date date, int interval) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		calendar.add(Calendar.DATE, interval);
		return calendar.getTime();
	}
	
	/**
	 * 获取当前日期所在星期的周<code>week</code>
	 * 
	 * @return 周<code>week</code>所属日期
	 */
	 public static Date getIntervalOfWeek(int week) {
		 return DateUtil.getIntervalOfWeek(DateUtil.getCurrentDate(), week);
	 }
	
	/**
	 * 获取指定日期所在星期的周<code>week</code>
	 * 
	 * @return 周<code>week</code>所属日期
	 */
	 public static Date getIntervalOfWeek(Date date, int week) {
		 Calendar calendar = Calendar.getInstance();
		 calendar.setTime(date);
		 int dayOfWeek = calendar.get(Calendar.DAY_OF_WEEK);
		 calendar.add(Calendar.DATE, -dayOfWeek);
		 calendar.add(Calendar.DATE, week);
		 return calendar.getTime();
	 }
	
	/**
	 * 获取当天距离指定月份间隔的日期
	 * 
	 * @param  interval 间隔月份(正数为向前推算,负数为向后推算)
	 * @return 距离指定月份间隔的日期
	 */
	public static Date getIntervalOfMonth(int interval) {
		return DateUtil.getIntervalOfMonth(DateUtil.getCurrentDate(), interval);
	}
	
	/**
	 * 获取距离指定月份间隔的日期
	 * 
	 * @param  date     日期
	 * @param  interval 间隔月份(正数为向前推算,负数为向后推算)
	 * @return 距离指定月份间隔的日期
	 */
	public static Date getIntervalOfMonth(Date date, int interval) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		calendar.add(Calendar.MONTH, interval);
		return calendar.getTime();
	}
	
	/**
	 * 获取当天距离指定年间隔的日期
	 * 
	 * @param  interval 间隔年(正数为向前推算,负数为向后推算)
	 * @return 距离指定年间隔的日期
	 */
	public static Date getIntervalOfYear(int interval) {
		return DateUtil.getIntervalOfYear(DateUtil.getCurrentDate(), interval);
	}
	
	/**
	 * 获取距离指定年间隔的日期
	 * 
	 * @param  date     日期
	 * @param  interval 间隔年(正数为向前推算,负数为向后推算)
	 * @return 距离指定年间隔的日期
	 */
	public static Date getIntervalOfYear(Date date, int interval) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		calendar.add(Calendar.YEAR, interval);
		return calendar.getTime();
	}
}
