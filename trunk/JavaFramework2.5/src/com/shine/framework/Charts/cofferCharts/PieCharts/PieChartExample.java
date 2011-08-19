package com.shine.framework.Charts.cofferCharts.PieCharts;

public class PieChartExample {

	/**
	 * 饼图使用例子
	 * 
	 * @param args
	 */
	public static void main(String[] args) {
		PieChartsHelper helper = new PieChartsHelper();
		helper.addPieChart("p1", 10, "0xffff00", "饼1");
		helper.addPieChart("p2", 10, "0xff00ff", "饼2");
		helper.addPieChart("p3", 10, "0x00ffff", "饼3");

		System.out.println(helper.getDataXml());
	}
}
