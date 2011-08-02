package com.shine.framework.Charts.ajofc;

import java.util.List;

import org.jofc.attribute.chart.BarChart;
import org.jofc.attribute.chart.element.value.BarValue;
import org.jofc.attribute.chart.element.value.LineValue;
import org.jofc.attribute.chart.element.value.PieValue;
import org.jofc.facade.JLineChart;
import org.jofc.facade.JPieChart;

/**
 * open flash chart2 工具类
 * 
 * @author viruscodecn@gmail.com
 * @lib org-jofc-0.8.20110729.jar
 * @libUrl http://code.google.com/p/ajofc/
 * 
 */
public class AjofcUtils {
	/**
	 * 获取线图json
	 * 
	 * @param values
	 * @return
	 */
	public static String getLineChart(Integer[]... values) {
		JLineChart lineChart = new JLineChart();
		for (Integer[] value : values) {
			lineChart.addLine(value);
		}
		return lineChart.toJSONString();
	}

	/**
	 * 获取线图json
	 * 
	 * @param values
	 * @return
	 */
	public static String getLineChart(List<LineValue>... values) {
		JLineChart lineChart = new JLineChart();
		for (List<LineValue> value : values) {
			lineChart.addLine(value);
		}
		return lineChart.toJSONString();
	}

	/**
	 * 获取饼图json
	 * 
	 * @param values
	 * @return
	 */
	public static String getPieChart(Integer[]... values) {
		JPieChart jPieChart = new JPieChart();
		for (Integer[] value : values) {
			jPieChart.setValues(value);
		}
		return jPieChart.toJSONString();
	}

	/**
	 * 获取饼图json
	 * 
	 * @param values
	 * @return
	 */
	public static String getPieChart(List<PieValue>... values) {
		JPieChart jPieChart = new JPieChart();
		for (List<PieValue> value : values) {
			jPieChart.setValues(value);
		}
		return jPieChart.toJSONString();
	}

	/**
	 * 获取柱形图
	 * 
	 * @param values
	 * @return
	 */
	public static String getBarChart(List<BarValue>... values) {
		BarChart barChart = new BarChart();
		for (List<BarValue> value : values) {
			barChart.appendValues(value);
		}
		return barChart.toJSONString();
	}

}
