package com.shine.framework.Charts.cofferCharts.LineCharts;

import java.util.ArrayList;
import java.util.List;

import org.dom4j.Document;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;

import com.shine.framework.core.util.XmlUitl;

public class LineChartsHelper {
	private List<Line> lineChartsList = null;
	private List<String> aixList = null;

	private String title = "";
	private String autoRefreshPolicy = "on";
	private String autoRefreshTime = "180";
	private String debug = "off";
	private String backGroudColor = "0xffffff";
	private String verticalTitle = "price";
	private String horizontalTitle = "date";
	//线条阴影
	private String seriesFilter = "on";
	private String form = "curve";
	private String showDataTips = "true";
	private String showAllDataTips = "false";
	private String legend = "true";

	public LineChartsHelper() {
		lineChartsList = new ArrayList<Line>();
		aixList = new ArrayList<String>();
	}

	public void addLine(Line line) {
		lineChartsList.add(line);
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
		dataElement.addAttribute("seriesFilter", seriesFilter);
		dataElement.addAttribute("form", form);
		dataElement.addAttribute("showDataTips", showDataTips);
		dataElement.addAttribute("showAllDataTips", showAllDataTips);
		dataElement.addAttribute("legend", legend);
		Element linesElement = dataElement.addElement("lines");
		for (Line line : lineChartsList) {
			Element lineElement = linesElement.addElement("line");
			lineElement.addAttribute("value", line.getValue());
			lineElement.addAttribute("label", line.getLabel());
			lineElement.addAttribute("color", line.getColor());
		}

		for (String s : aixList) {
			Element nodeElement = dataElement.addElement("node");
			nodeElement.addAttribute("label", s);
			for (Line line : lineChartsList) {
				if (line.get(s) != null) {
					nodeElement.addAttribute(line.getValue(), String
							.valueOf(line.get(s)));
				} else {
					nodeElement.addAttribute(line.getValue(), "0");
				}
			}

		}
		return XmlUitl.doc2String(document);
	}

	public void clean() {
		lineChartsList.clear();
		aixList.clear();
	}

	public List<Line> getLineChartsList() {
		return lineChartsList;
	}

	public void setLineChartsList(List<Line> lineChartsList) {
		this.lineChartsList = lineChartsList;
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

	public String getForm() {
		return form;
	}

	public void setForm(String form) {
		this.form = form;
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

	public String getSeriesFilter() {
		return seriesFilter;
	}

	public void setSeriesFilter(String seriesFilter) {
		this.seriesFilter = seriesFilter;
	}

}
