package com.shine.framework.Charts.cofferCharts.DashboardChart;



public class DashboardChartsExample {
	public static void main(String[] args) {
		DashboardChartsHelper da=new DashboardChartsHelper();
		da.setTitle("neichun");
		da.setAutoRefreshPolicy("on");
		da.setAutoRefreshTime("180");
		da.setDebug("off");
		da.setBackGroudColor("0xffffff");
		da.setValue("80");
		System.out.println(da.getDataXml());
//		<?xml version="1.0" encoding="UTF-8"?>
//		<data title="123" autoRefreshPolicy="on" autoRefreshTime="180" debug="off"
//			backGroudColor="0xffffff"  value="50" />

	}
}
