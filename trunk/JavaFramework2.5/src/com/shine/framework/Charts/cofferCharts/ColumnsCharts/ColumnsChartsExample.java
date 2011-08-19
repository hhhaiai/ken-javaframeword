package com.shine.framework.Charts.cofferCharts.ColumnsCharts;

import com.shine.framework.Charts.cofferCharts.LineCharts.Line;
import com.shine.framework.Charts.cofferCharts.LineCharts.LineChartsHelper;

public class ColumnsChartsExample {

	/**
	 * 柱图例子
	 * 
	 * @param args
	 */
	public static void main(String[] args) {
		Colunms colunms = new Colunms("colunms1", "线1", "0x00ffff");
		colunms.put("1", 100);
		colunms.put("2", 300);
		colunms.put("3", 100);

		Colunms colunms1 = new Colunms("colunms2", "线1", "0xffff00");
		colunms1.put("1", 200);
		colunms1.put("3", 500);

		ColumnsChartsHelper helper = new ColumnsChartsHelper();
		helper.addAix("1", "2", "3");
		helper.addColunms(colunms);
		helper.addColunms(colunms1);

		System.out.println(helper.getDataXml());

	}

}
