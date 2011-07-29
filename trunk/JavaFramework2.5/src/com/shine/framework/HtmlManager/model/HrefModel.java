package com.shine.framework.HtmlManager.model;

import com.shine.framework.core.util.DataUtil;


/**
 * HrefModel 超链接model
 * @author viruscodecn@gmail.com
 * @project JavaFramework 1.0 2010-12-02
 */
final public class HrefModel extends HtmlBaseModel {
	/**
	 * 获取超链接
	 * @return
	 */
	public String getHref() {
		return this.getString("href");
	}

	/**
	 * 获取超链接描述
	 * @return
	 */
	public String getTxt() {
		return this.getTagText();
	}

	/**
	 * 获取超链接的操作
	 * @return
	 */
	public String getTarget() {
		String s = this.getString("target");
		if (DataUtil.isNull(s) || s.equals("null"))
			return "_self";
		return s;
	}
}
