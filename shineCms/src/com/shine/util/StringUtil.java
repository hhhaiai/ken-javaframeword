package com.shine.util;

import java.security.MessageDigest;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Random;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.codec.binary.Base64;

/**
 * String工具类
 * @author JiangKunpeng	2011.06.10
 * @version 2012.02.15
 */
final public class StringUtil {
	public static final SimpleDateFormat datetimeFormat = new SimpleDateFormat("yyMMddHHmmssSSS");

	public static final Random random = new Random();

	private StringUtil() {
	}

	/**
	 * 判断是否为空字符串
	 * 
	 * @param str
	 * @return
	 */
	public static boolean isEmpty(final String str) {
		return str == null || str.length() < 1;
	}

	/**
	 * 加密
	 * 
	 * @param algorithm
	 *            加密算法(MD5/SHA/SHA-256等)
	 * @param str
	 *            要加密的字符串
	 * @param salt
	 *            盐值(可为空)
	 * @return
	 */
	public static String encrypt(String algorithm, String str, Object salt) {
		if (isEmpty(str))
			return null;
		if (salt != null && !"".equals(salt))
			str += "{" + salt.toString() + "}";
		try {
			MessageDigest md = MessageDigest.getInstance(algorithm);
			byte[] digest = md.digest(str.getBytes("UTF-8"));
			return new String(Base64.encodeBase64(digest));
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	/**
	 * 获取时间戳和随机数组成的ID值
	 * 
	 * @param prefix
	 *            前缀
	 * @param randomLength
	 *            随机数长度
	 * @return 返回结果格式为：前缀+时间戳+随机数<br/>
	 *         时间戳长度为:15,Format表达式为:yyMMddHHmmssSSS
	 */
	public static synchronized String getTimeRandomID(String prefix, int randomLength) {
		String id = prefix == null ? "" : prefix;
		id += datetimeFormat.format(new Date());
		if (randomLength > 0)
			id += getRandomNumStr(randomLength);
		return id;
	}

	/**
	 * 获取数字组成的随机字符串
	 * 
	 * @param length
	 *            长度
	 * @return
	 */
	public static synchronized String getRandomNumStr(int length) {
		StringBuffer sb = new StringBuffer(length);
		for (int i = 0; i < length; i++)
			sb.append(random.nextInt(10));
		return sb.toString();
	}

	/**
	 * 将html转成text (转义< 和 >)
	 * 
	 * @param html
	 * @return
	 */
	public static String Html2Text(String html) {
		if (html == null)
			return null;
		return html.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
	}

	// 匹配<script>...</script>的正则表达式
	private static final String regEx_script = "<[\\s]*?script[^>]*?>[\\s\\S]*?<[\\s]*?\\/[\\s]*?script[\\s]*?>"; // 定义script的正则表达式{或<script[^>]*?>[\\s\\S]*?<\\/script>
	// 匹配<style>...</style>的正则表达式
	private static final String regEx_style = "<[\\s]*?style[^>]*?>[\\s\\S]*?<[\\s]*?\\/[\\s]*?style[\\s]*?>"; // 定义style的正则表达式{或<style[^>]*?>[\\s\\S]*?<\\/style>
	private static final String regEx_html = "<[^>]+>"; // 定义HTML标签的正则表达式

	/**
	 * 清除html样式
	 * 
	 * @param inputString
	 * @return
	 */
	public static String cleanHtml(String inputString) {
		String htmlStr = inputString; // 含html标签的字符串
		String textStr = "";
		Pattern p_script;
		Matcher m_script;
		Pattern p_style;
		Matcher m_style;
		Pattern p_html;
		Matcher m_html;

		p_script = Pattern.compile(regEx_script, Pattern.CASE_INSENSITIVE);
		m_script = p_script.matcher(htmlStr);
		htmlStr = m_script.replaceAll(""); // 过滤script标签

		p_style = Pattern.compile(regEx_style, Pattern.CASE_INSENSITIVE);
		m_style = p_style.matcher(htmlStr);
		htmlStr = m_style.replaceAll(""); // 过滤style标签

		p_html = Pattern.compile(regEx_html, Pattern.CASE_INSENSITIVE);
		m_html = p_html.matcher(htmlStr);
		htmlStr = m_html.replaceAll(""); // 过滤html标签

		textStr = htmlStr.replaceAll("[\\n|\\r|\\t|  ]", ""); // 过滤空格换行Tab符

		return textStr;// 返回文本字符串
	}
}
