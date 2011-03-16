package com.shine.framework.core.util;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;

/**
 * html utilities
 * 
 * @author viruscodecn@gmail.com
 * @project JavaFramework 2.0 2011-02-12
 */
public class HtmlUtil {
	/**
	 * 获取url数据，默认utf-8
	 * 
	 * @param urlPath
	 * @return
	 */
	public static String getUrlString(String urlPath) {
		return getUrlString(urlPath, "UTF-8");
	}

	/**
	 * 获取url数据
	 * 
	 * @param url
	 * @return
	 */
	@SuppressWarnings("static-access")
	public static String getUrlString(String urlPath, String encoding) {
		String charSet = encoding.trim();
		BufferedReader in = null;
		String content = "";
		try {
			URL url = new URL(urlPath);
			URLConnection con = url.openConnection();
			con.setAllowUserInteraction(false);
			con.connect();

			String type = con.guessContentTypeFromStream(con.getInputStream());
			if (type == null)
				type = con.getContentType();

			if (type == null || type.trim().length() == 0
					|| type.trim().indexOf("text/html") < 0)
				return null;

			if (type.indexOf("charset=") > 0)
				charSet = type.substring(type.indexOf("charset=") + 8);
			in = new BufferedReader(new InputStreamReader(con.getInputStream(),
					charSet));

			String temp;
			while ((temp = in.readLine()) != null) {
				content += temp + "\n";
			}
			return content;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		} finally {
			try {
				if (in != null)
					in.close();
			} catch (IOException e) {

			}
		}
	}

	/**
	 * 保存网页内存到文件默认UTF-8
	 * 
	 * @param urlPath
	 * @param filePath
	 * @return
	 */
	public static boolean saveUrltoFile(String urlPath, String filePath) {
		return saveUrltoFile(urlPath, filePath, "UTF-8");
	}

	/**
	 * 保存网页内存到文件
	 * 
	 * @param urlPath
	 * @param filePath
	 * @param encoding
	 * @return
	 */
	public static boolean saveUrltoFile(String urlPath, String filePath,
			String encoding) {
		FileUtil
				.createFile(filePath, getUrlString(urlPath, encoding), encoding);
		return true;
	}

	public static void main(String args[]) {
		System.out.println(HtmlUtil.getUrlString("http://www.hao123.com",
				"gb2312"));
	}
}
