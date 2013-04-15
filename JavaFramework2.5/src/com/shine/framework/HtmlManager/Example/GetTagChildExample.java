package com.shine.framework.HtmlManager.Example;

import java.util.List;

import com.shine.framework.HtmlManager.HtmlManager;
import com.shine.framework.HtmlManager.model.HtmlBaseModel;
import com.shine.framework.core.util.HtmlUtil;

public class GetTagChildExample {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		HtmlManager helper = new HtmlManager(HtmlUtil.getUrlString(
				"http://www.hao123.com", "gb2312"));
		List<HtmlBaseModel> list = helper.getTag("form", "id=js_sug-form1");
		List<HtmlBaseModel> childList = list.get(0).getChildList();
		for (HtmlBaseModel model : childList) {
			System.out.println(model.getTagContent());
		}

	}

}
