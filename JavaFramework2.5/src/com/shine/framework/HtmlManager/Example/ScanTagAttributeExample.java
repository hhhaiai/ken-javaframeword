package com.shine.framework.HtmlManager.Example;

import java.util.List;

import com.shine.framework.HtmlManager.HtmlManager;
import com.shine.framework.HtmlManager.model.HtmlBaseModel;
import com.shine.framework.core.util.HtmlUtil;

public class ScanTagAttributeExample {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		HtmlManager helper = new HtmlManager(HtmlUtil.getUrlString(
				"http://www.hao123.com", "gb2312"));
		List<HtmlBaseModel> list = helper.getTag("a");
		for (HtmlBaseModel b : list) {
			//获取所有超链接
			System.out.println(b.get("href"));
		}
		
		for (HtmlBaseModel b : list) {
			//获取所有内容
			System.out.println(b.getTagText());
		}
	}

}
