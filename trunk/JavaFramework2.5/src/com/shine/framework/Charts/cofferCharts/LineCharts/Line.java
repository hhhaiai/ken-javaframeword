package com.shine.framework.Charts.cofferCharts.LineCharts;

import java.util.HashMap;

public class Line extends HashMap<String, Integer> {
	private String value = "";
	private String label = "";
	private String color = "";

	public Line(String value, String label, String color) {
		this.value = value;
		this.label = label;
		this.color = color;
	}

	public void addNode(String date, String values) {
		this.addNode(date, values);
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	public String getLabel() {
		return label;
	}

	public void setLabel(String label) {
		this.label = label;
	}

	public String getColor() {
		return color;
	}

	public void setColor(String color) {
		this.color = color;
	}

}
