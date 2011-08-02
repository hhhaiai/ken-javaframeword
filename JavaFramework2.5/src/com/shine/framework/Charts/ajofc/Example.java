package com.shine.framework.Charts.ajofc;

public class Example {
	/**
	 * 报表线图json生成
	 * 
	 * @param args
	 */
	public static void main(String args[]) {
		Integer[] values = { 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 };
		
		System.out.println(AjofcUtils.getLineChart(values,values));
	}
}
