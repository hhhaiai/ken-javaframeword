package com.shine.framework.Charts.cofferCharts.PieCharts;

import java.util.ArrayList;
import java.util.List;

import org.dom4j.Document;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;

import com.shine.framework.Charts.cofferCharts.LineCharts.Line;
import com.shine.framework.core.util.XmlUitl;

public class PieChartsHelper {
	private String title = "";
	private String autoRefreshPolicy = "on";
	private String autoRefreshTime = "180";
	private String debug = "off";
	private String clickType = "pop";
	private String backGroudColor = "0xffffff";
	private String showDataTips = "true";
	private String showAllDataTips = "false";
	private String labelPosition = "callout";
	private String legend = "true";

	private List<PieChartModel> pieList = null;

	public PieChartsHelper() {
		pieList = new ArrayList<PieChartModel>();
	}

	/**
	 * 加入饼图块
	 * 
	 * @param label
	 * @param value
	 * @param color
	 * @param description
	 */
	public void addPieChart(String label, int value, String color,
			String description) {
		PieChartModel model = new PieChartModel(label, value, color,
				description);
		pieList.add(model);
	}

	public String getDataXml() {
		Document document = DocumentHelper.createDocument();
		Element dataElement = document.addElement("data");
		dataElement.addAttribute("title", title);
		dataElement.addAttribute("autoRefreshPolicy", autoRefreshPolicy);
		dataElement.addAttribute("autoRefreshTime", autoRefreshTime);
		dataElement.addAttribute("debug", debug);
		dataElement.addAttribute("backGroudColor", backGroudColor);
		dataElement.addAttribute("clickType", clickType);
		dataElement.addAttribute("showDataTips", showDataTips);
		dataElement.addAttribute("showAllDataTips", showAllDataTips);
		dataElement.addAttribute("labelPosition", labelPosition);
		dataElement.addAttribute("legend", legend);

		for (PieChartModel model : pieList) {
			Element nodeElement = dataElement.addElement("node");
			nodeElement.addAttribute("label", model.getLabel());
			nodeElement.addAttribute("value", String.valueOf(model.getValue()));
			nodeElement.addAttribute("color", model.getColor());
			nodeElement.addAttribute("description", model.getDescription());
		}

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

	public String getClickType() {
		return clickType;
	}

	public void setClickType(String clickType) {
		this.clickType = clickType;
	}

	public String getBackGroudColor() {
		return backGroudColor;
	}

	public void setBackGroudColor(String backGroudColor) {
		this.backGroudColor = backGroudColor;
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

	public String getLabelPosition() {
		return labelPosition;
	}

	public void setLabelPosition(String labelPosition) {
		this.labelPosition = labelPosition;
	}

}
