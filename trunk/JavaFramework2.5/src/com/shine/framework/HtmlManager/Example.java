package com.shine.framework.HtmlManager;

import java.util.List;

import com.shine.framework.HtmlManager.model.HtmlBaseModel;
import com.shine.framework.core.util.HtmlUtil;

public class Example {
	public static void main(String args[]) {
		HtmlManager helper = new HtmlManager(HtmlUtil.getUrlString(
				"http://www.hao123.com", "gb2312"));
		List<HtmlBaseModel> list = helper.getTag("a", "class=set_home");
		for (HtmlBaseModel b : list) {
			System.out.println(b.getTagContent());
		}
	}
}
