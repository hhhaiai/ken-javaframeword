package com.shine.framework.Charts.cofferCharts.PieCharts;

public class PieChartModel {
	private String label;
	private int value;
	private String color;
	private String description;

	public PieChartModel() {

	}

	public PieChartModel(String label, int value, String color,
			String description) {
		this.value = value;
		this.label = label;
		this.color = color;
		this.description = description;
	}

	public String getLabel() {
		return label;
	}

	public void setLabel(String label) {
		this.label = label;
	}

	public int getValue() {
		return value;
	}

	public void setValue(int value) {
		this.value = value;
	}

	public String getColor() {
		return color;
	}

	public void setColor(String color) {
		this.color = color;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

}
