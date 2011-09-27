package com.shine.framework.Charts.cofferCharts.DashboardChart;

import java.util.ArrayList;
import java.util.List;

import org.dom4j.Document;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;

import com.shine.framework.Charts.cofferCharts.ColumnsCharts.Colunms;
import com.shine.framework.core.util.XmlUitl;

public class DashboardChartsHelper {
	private String title = "";
	private String autoRefreshPolicy = "on";
	private String autoRefreshTime = "180";
	private String debug = "off";
	private String backGroudColor = "0xffffff";
	private String verticalTitle = "";
	private String horizontalTitle = "";
	private String showDataTips = "true";
	private String showAllDataTips = "false";
	private String legend = "true";
	private String value="";
	/**
	 * 输出xml数据
	 * 
	 * @return
	 */
	public String getDataXml() {
		Document document = DocumentHelper.createDocument();
		Element dataElement = document.addElement("data");
		dataElement.addAttribute("title", title);
		dataElement.addAttribute("autoRefreshPolicy", autoRefreshPolicy);
		dataElement.addAttribute("autoRefreshTime", autoRefreshTime);
		dataElement.addAttribute("debug", debug);
		dataElement.addAttribute("backGroudColor", backGroudColor);
//		dataElement.addAttribute("verticalTitle", verticalTitle);
//		dataElement.addAttribute("horizontalTitle", horizontalTitle);
//		dataElement.addAttribute("showDataTips", showDataTips);
//		dataElement.addAttribute("showAllDataTips", showAllDataTips);
//		dataElement.addAttribute("legend", legend);
		dataElement.addAttribute("value",value);
		return XmlUitl.doc2String(document);
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getAutoRefreshPolicy() {
		return autoRefreshPolicy;
	}

	public void setAutoRefreshPolicy(String autoRefreshPolicy) {
		this.autoRefreshPolicy = autoRefreshPolicy;
	}

	public String getAutoRefreshTime() {
		return autoRefreshTime;
	}

	public void setAutoRefreshTime(String autoRefreshTime) {
		this.autoRefreshTime = autoRefreshTime;
	}

	public String getDebug() {
		return debug;
	}

	public void setDebug(String debug) {
		this.debug = debug;
	}

	public String getBackGroudColor() {
		return backGroudColor;
	}

	public void setBackGroudColor(String backGroudColor) {
		this.backGroudColor = backGroudColor;
	}

	public String getVerticalTitle() {
		return verticalTitle;
	}

	public void setVerticalTitle(String verticalTitle) {
		this.verticalTitle = verticalTitle;
	}

	public String getHorizontalTitle() {
		return horizontalTitle;
	}

	public void setHorizontalTitle(String horizontalTitle) {
		this.horizontalTitle = horizontalTitle;
	}

	public String getShowDataTips() {
		return showDataTips;
	}

	public void setShowDataTips(String showDataTips) {
		this.showDataTips = showDataTips;
	}

	public String getShowAllDataTips() {
		return showAllDataTips;
	}

	public void setShowAllDataTips(String showAllDataTips) {
		this.showAllDataTips = showAllDataTips;
	}

	public String getLegend() {
		return legend;
	}

	public void setLegend(String legend) {
		this.legend = legend;
	}
	
	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}
}
