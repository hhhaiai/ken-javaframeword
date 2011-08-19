package com.shine.framework.Charts.cofferCharts.LineCharts;

public class LineChartsExample {

	/**
	 * 生成线图例子
	 * 
	 * @param args
	 */
	public static void main(String[] args) {
		Line line1 = new Line("line1", "线1", "0x000000");
		line1.put("1", 100);
		line1.put("3", 100);

		LineChartsHelper helper = new LineChartsHelper();
		helper.addAix("1", "2", "3");
		helper.addLine(line1);

		System.out.println(helper.getDataXml());
	}

}
