package com.shine.framework.Charts.cofferCharts.ColumnsCharts;

import java.util.ArrayList;
import java.util.List;

import org.dom4j.Document;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;

import com.shine.framework.core.util.XmlUitl;

public class ColumnsChartsHelper {
	private List<Colunms> columnsChartsList = null;
	private List<String> aixList = null;

	private String title = "";
	private String autoRefreshPolicy = "on";
	private String autoRefreshTime = "180";
	private String debug = "off";
	private String backGroudColor = "0xffffff";
	private String verticalTitle = "";
	private String horizontalTitle = "";
	private String type = "clustered";
	private String showDataTips = "true";
	private String showAllDataTips = "false";
	private String legend = "true";

	public ColumnsChartsHelper() {
		columnsChartsList = new ArrayList<Colunms>();
		aixList = new ArrayList<String>();
	}

	public void addColunms(Colunms colunms) {
		columnsChartsList.add(colunms);
	}

	public void addAix(String... aix) {
		for (String s : aix)
			if (!aixList.contains(s))
				aixList.add(s);
	}

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
		dataElement.addAttribute("verticalTitle", verticalTitle);
		dataElement.addAttribute("horizontalTitle", horizontalTitle);
		dataElement.addAttribute("type", type);
		dataElement.addAttribute("showDataTips", showDataTips);
		dataElement.addAttribute("showAllDataTips", showAllDataTips);
		dataElement.addAttribute("legend", legend);
		Element linesElement = dataElement.addElement("columns");
		for (Colunms colunms : columnsChartsList) {
			Element lineElement = linesElement.addElement("column");
			lineElement.addAttribute("value", colunms.getValue());
			lineElement.addAttribute("label", colunms.getLabel());
			lineElement.addAttribute("color", colunms.getColor());
		}

		for (String s : aixList) {
			Element nodeElement = dataElement.addElement("node");
			nodeElement.addAttribute("label", s);
			for (Colunms colunms : columnsChartsList) {
				if (colunms.get(s) != null) {
					nodeElement.addAttribute(colunms.getValue(), String
							.valueOf(colunms.get(s)));
				} else {
					nodeElement.addAttribute(colunms.getValue(), "0");
				}
			}

		}
		return XmlUitl.doc2String(document);
	}

	public void clean() {
		columnsChartsList.clear();
		aixList.clear();
	}

	public List<Colunms> getColumnsChartsList() {
		return columnsChartsList;
	}

	public void setColumnsChartsList(List<Colunms> columnsChartsList) {
		this.columnsChartsList = columnsChartsList;
	}

	public List<String> getAixList() {
		return aixList;
	}

	public void setAixList(List<String> aixList) {
		this.aixList = aixList;
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

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
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
	
	
}
