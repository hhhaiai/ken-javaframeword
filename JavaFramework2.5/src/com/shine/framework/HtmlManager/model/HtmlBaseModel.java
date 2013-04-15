package com.shine.framework.HtmlManager.model;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.dom4j.Document;
import org.dom4j.Element;

import com.shine.framework.core.util.DataUtil;
import com.shine.framework.core.util.XmlUitl;

/**
 * HtmlBaseModel
 * 
 * @author viruscodecn@gmail.com
 * @project JavaFramework 1.0 2010-12-02
 */
public class HtmlBaseModel extends HashMap<String, String> {
	// html标签
	private String tagName;
	// 标签中间内容
	private String tagText;
	// 标签内容
	private String tagContent;
	// child list
	private List<HtmlBaseModel> childList = new ArrayList<HtmlBaseModel>();

	public HtmlBaseModel() {

	}

	public HtmlBaseModel(String htmlString) {
		init(htmlString);
	}

	/**
	 * 初始化html标签
	 * 
	 * @param htmltag
	 */
	public void init(String htmlString) {
		Document doc = XmlUitl.string2Document(htmlString);
		Map map = XmlUitl.getAllAttribute(doc.getRootElement());
		Set set = map.entrySet();
		Iterator i = set.iterator();
		while (i.hasNext()) {
			Map.Entry me = (Map.Entry) i.next();
			this.put(((String) me.getKey()).toLowerCase(), ((String) me
					.getValue()).toLowerCase());
		}
		map = null;

		if (doc.getName() != null)
			this.tagName = doc.getName().toLowerCase();
		else
			this.tagName = doc.getName();
		this.tagContent = htmlString;
		this.tagText = doc.getRootElement().getText();

		List<Element> list = XmlUitl.getAllElement(doc.getRootElement());
		childList.clear();
		if (!list.isEmpty()) {
			for (Element element : list) {
				if (!DataUtil.isNull(element.getText())) {
					childList.add((new HtmlBaseModel(element.getText())));
				}

			}
		}

		list = null;
	}

	public String getString(String key) {
		return String.valueOf(this.get(key));
	}

	public String getTagName() {
		return tagName;
	}

	public void setTagName(String tagName) {
		this.tagName = tagName;
	}

	public String getTagText() {
		return tagText;
	}

	public void setTagText(String tagText) {
		this.tagText = tagText;
	}

	public String getTagContent() {
		return tagContent;
	}

	public void setTagContent(String tagContent) {
		this.tagContent = tagContent;
	}

	public List<HtmlBaseModel> getChildList() {
		return childList;
	}
}
