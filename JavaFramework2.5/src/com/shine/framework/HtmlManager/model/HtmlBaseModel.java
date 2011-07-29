package com.shine.framework.HtmlManager.model;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;

import org.dom4j.Document;

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

	/**
	 * 获取属性中的name
	 * 
	 * @return
	 */
	private String getName() {
		return getString("name");
	}

	/**
	 * 获取属性中id
	 * 
	 * @return
	 */
	private String getId() {
		return getString("id");
	}

	/**
	 * 获取title属性
	 * 
	 * @return
	 */
	private String getTitle() {
		return getString("title");
	}

	/**
	 * 获取class属性
	 * 
	 * @return
	 */
	private String getTagClass() {
		return getString("class");
	}

	/**
	 * 获取Style属性
	 * 
	 * @return
	 */
	private String getStyle() {
		return getString("style");
	}

	/**
	 * 获取lang属性
	 * 
	 * @return
	 */
	private String getLang() {
		return getString("lang");
	}

	/**
	 * 获取点击事件
	 * 
	 * @return
	 */
	public String getOnclick() {
		return this.getString("onclick");
	}

	public static Object getHtmlTagType(String tagName) {
		if (tagName.equals("a")) {
			return new HrefModel();
		} else if (tagName.equals("img")) {
			return new ImgModel();
		} else if (tagName.equals("table")) {
			return new TableModel();
		} else if (tagName.equals("tbody")) {
			return new TbodyModel();
		} else if (tagName.equals("tr")) {
			return new TrModel();
		} else if (tagName.equals("td")) {
			return new TdModel();
		} else if (tagName.equals("body")) {
			return new BodyModel();
		} else if (tagName.equals("iframe")) {
			return new IframeModel();
		} else if (tagName.equals("div")) {
			return new DivModel();
		} else if (tagName.equals("script")) {
			return new DivModel();
		} else {
			return new HtmlBaseModel();
		}
	}
}
