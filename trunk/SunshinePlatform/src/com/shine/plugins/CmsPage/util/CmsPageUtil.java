package com.shine.plugins.CmsPage.util;

public class CmsPageUtil {
	/**
	 * 生成page path
	 * 
	 * @param uploadPageType
	 * @param pageName
	 * @return
	 */
	public static String makeupPagePath(String views, String uploadPageType,
			String pageName) {
		StringBuffer buffer = new StringBuffer();
		buffer.append("/");
		buffer.append(views);
		buffer.append("/");
		buffer.append(uploadPageType);
		buffer.append("/");
		buffer.append(pageName);
		buffer.append(".jsp");
		return buffer.toString();
	}
}
