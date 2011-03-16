package com.shine.framework.HtmlManager;

import java.util.ArrayList;
import java.util.List;

import org.dom4j.Element;

import com.shine.framework.HtmlManager.model.HtmlBaseModel;
import com.shine.framework.core.util.HtmlUtil;
import com.shine.framework.core.util.XmlUitl;
import com.sun.jndi.toolkit.url.UrlUtil;

/**
 * HtmlHelper 用來解析html dom
 * 
 * @author viruscodecn@gmail.com
 * @project JavaFramework 1.0 2010-12-03
 */
public class HtmlManager {
	// html String
	private String htmlString;

	public HtmlManager(String htmlString) {
		this.htmlString = htmlString;
	}

	public String getHtmlString() {
		return htmlString;
	}

	public void setHtmlString(String htmlString) {
		this.htmlString = htmlString;
	}

	/**
	 * 获取html标签数据
	 * 
	 * @param tagName
	 * @param arg
	 * @return
	 */
	public List<HtmlBaseModel> getTag(String tagName, String... arg) {
		List<HtmlParm> htmlParmList = getHtmlParm(arg);
		List<Element> list = XmlUitl.getAllTag(XmlUitl.string2Document(HtmlUtil
				.cleanHtmlByString(this.htmlString)), tagName, false);
		List<HtmlBaseModel> htmlList = new ArrayList<HtmlBaseModel>();
		for (Element ele : list) {
			HtmlBaseModel htmlBaseModel = new HtmlBaseModel();
			htmlBaseModel.init(ele.asXML());
			if (checkHtmlParm(htmlParmList, htmlBaseModel))
				htmlList.add(htmlBaseModel);
		}
		return htmlList;
	}

	/**
	 * 检查参数
	 * 
	 * @param list
	 * @param htmlBaseModel
	 * @return
	 */
	private boolean checkHtmlParm(List<HtmlParm> list,
			HtmlBaseModel htmlBaseModel) {
		for (HtmlParm htmlParm : list) {
			if (htmlBaseModel.getString(htmlParm.getName()).equals(
					htmlParm.getValue())) {
			} else {
				return false;
			}
		}
		return true;
	}

	/**
	 * 把参数保存到list
	 * 
	 * @param arg
	 * @return
	 */
	private List<HtmlParm> getHtmlParm(String... arg) {
		List<HtmlParm> list = new ArrayList<HtmlParm>();
		for (int i = 0; i < arg.length; i++) {
			String parm[] = arg[i].split("=");
			HtmlParm h = new HtmlParm();
			h.setName(parm[0]);
			h.setValue(parm[1]);
			list.add(h);
			h = null;
		}
		return list;
	}
}

class HtmlParm {
	private String name;
	private String value;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}
}