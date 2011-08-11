/**
 * <p>Description:netflow utility</p>
 * <p>Company:shine</p>
 * @author afu
 * @project sourceflow2.0
 * @date 20080428
 */

package com.shine.Netflow.utils;

import java.text.SimpleDateFormat;
import java.util.*;

import com.shine.framework.core.util.DateUtil;

public class NetFlowUtil {
	private static Map<Integer, String> protocols;

	private NetFlowUtil() {
	}

	static {
		protocols = new HashMap<Integer, String>();
		protocols.put(1, "ICMP");
		protocols.put(6, "TCP");
		protocols.put(17, "UDP");

	}

	/**
	 * 获取数据包的版本
	 * 
	 * @param buffer
	 * @return
	 */
	public static int getFlowVersion(byte[] buffer) {
		return toIntNumber(buffer, 0, 2);
	}

	public static String getProtocol(final String code) {
		return getProtocol(Integer.parseInt(code));
	}

	public static String getProtocol(final int code) {
		if (!protocols.containsKey(code)) {
			return null;
		}
		return protocols.get(code);
	}

	public static int toIntNumber(final byte[] p, final int off, final int len) {
		int ret = 0;
		int done = off + len;
		for (int i = off; i < done; i++)
			ret = ((ret << 8) & 0xffffffff) + (p[i] & 0xff);
		return ret;
	}

	public static long toLongNumber(final byte[] p, final int off, final int len) {
		long ret = 0;
		int done = off + len;
		for (int i = off; i < done; i++)
			ret = ((ret << 8) & 0xffffffff) + (p[i] & 0xff);
		return ret;
	}

	/**
	 * identify an ip is valid
	 */
	public static boolean checkIp(String ipAddress) {
		boolean isValid = true;
		try {
			StringTokenizer st = new StringTokenizer(ipAddress, ".");
			int len = st.countTokens();
			if (len != 4)
				return false;

			int ipSegment = 0;
			for (int i = 0; i < len; i++) {
				ipSegment = Integer.parseInt(st.nextToken());
				if (ipSegment < 0 || ipSegment > 255) {
					isValid = false;
					break;
				}
			}
		} catch (Exception e) {
			isValid = false;
		}
		return isValid;
	}

	public static String convertIP(final long addr) {
		StringBuffer buf = new StringBuffer();
		buf.append(((addr >>> 24) & 0xff)).append('.').append(
				((addr >>> 16) & 0xff)).append('.').append(
				((addr >>> 8) & 0xff)).append('.').append(addr & 0xff);
		return buf.toString();
	}

	public static String getTomorrowDate() {
		Date date = new Date();
		Calendar calendar = new GregorianCalendar();
		calendar.setTime(date);
		calendar.add(calendar.DATE, 1);// 把日期往后增加一天.整数往后推,负数往前移动
		SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMdd");
		String tomorrow = formatter.format(calendar.getTime());

		return tomorrow;
	}

	public static String getNextMonth() {
		Date date = new Date();
		Calendar calendar = new GregorianCalendar();
		calendar.setTime(date);
		calendar.add(calendar.MONTH, 1);// 把日期往后增加一天.整数往后推,负数往前移动
		SimpleDateFormat formatter = new SimpleDateFormat("yyyyMM");
		String nextMonth = formatter.format(calendar.getTime());

		return nextMonth;
	}

	public static String getTodayDate() {
		Date date = new Date();
		Calendar calendar = new GregorianCalendar();
		calendar.setTime(date);
		SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMdd");
		String today = formatter.format(calendar.getTime());

		return today;
	}

	public static String getThisMonth() {
		Date date = new Date();
		Calendar calendar = new GregorianCalendar();
		calendar.setTime(date);
		SimpleDateFormat formatter = new SimpleDateFormat("yyyyMM");
		String thisMonth = formatter.format(calendar.getTime());

		return thisMonth;
	}

	/**
	 * get the first day and the last day of a month
	 */
	public static String[] getMonthDays(final String day) {
		Date date = null;
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
		try {
			date = sdf.parse(day);
		} catch (java.text.ParseException pe) {
			return null;
		}

		String[] firstAndLast = new String[2];
		firstAndLast[0] = day.substring(0, 6) + "01";
		Calendar cdar = new GregorianCalendar();
		cdar.set(date.getYear(), date.getMonth(), 1);
		firstAndLast[1] = day.substring(0, 6)
				+ cdar.getActualMaximum(Calendar.DAY_OF_MONTH);

		return firstAndLast;
	}

	/**
	 * get monday and sunday of a week
	 */
	public static String[] getWeekDays(final String day) {
		Date date = null;
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
		try {
			date = sdf.parse(day);
		} catch (java.text.ParseException pe) {
			return null;
		}
		Calendar cld = Calendar.getInstance();
		cld.setFirstDayOfWeek(Calendar.MONDAY);
		cld.setTime(date);
		GregorianCalendar cal = new GregorianCalendar();
		cal.setTime(date);
		cal.set(GregorianCalendar.DAY_OF_WEEK, GregorianCalendar.MONDAY);

		String[] monthAndSunday = new String[2];
		monthAndSunday[0] = new SimpleDateFormat("yyyyMMdd").format(cal
				.getTime());

		cal.add(GregorianCalendar.DAY_OF_MONTH, 6);
		monthAndSunday[1] = new SimpleDateFormat("yyyyMMdd").format(cal
				.getTime());

		return monthAndSunday;
	}

	/**
	 * calculate start ip and end ip according to subnet address and its mask
	 */
	public static long[] getBoundaryIPs(final String netAddress,
			final String netMask) {
		long longNetAddress = convertLongIP(netAddress);
		long maxLong = (new Long("4294967296")).longValue();
		long longNetMask = convertLongIP(netMask);
		long ipAmount = maxLong - longNetMask;

		long[] ips = new long[2];
		ips[0] = longNetAddress + 1;
		ips[1] = longNetAddress + ipAmount - 1;

		return ips;
	}

	public static final long convertLongIP(final String ip) {
		char[] c = ip.toCharArray();
		byte[] b = { 0, 0, 0, 0 };
		for (int i = 0, j = 0; i < c.length;) {
			int d = (byte) (c[i] - '0');
			switch (c[i++]) {
			case '.':
				++j;
				break;
			default:
				if ((d < 0) || (d > 9))
					return 0;
				if ((b[j] & 0xff) * 10 + d > 255)
					return 0;
				b[j] = (byte) (b[j] * 10 + d);
			}
		}
		return 0x00000000ffffffffl & (b[0] << 24 | (b[1] & 0xff) << 16
				| (b[2] & 0xff) << 8 | (b[3] & 0xff));
	}

	public static long timeToLong(final String time) {
		long timeLong = 0;
		try {
			SimpleDateFormat dateFormat = new java.text.SimpleDateFormat(
					"yyyy-MM-dd hh:mm:ss");
			Date date = dateFormat.parse(time);
			timeLong = date.getTime() / 1000;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return timeLong;
	}

	public static void main(String[] args) {
		String temp[] = NetFlowUtil.getWeekDays("20080516");
		System.out.println(temp[0] + "," + temp[1]);
	}
}
