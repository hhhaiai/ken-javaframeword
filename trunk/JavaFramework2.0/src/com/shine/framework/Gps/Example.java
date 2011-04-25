package com.shine.framework.Gps;

import java.util.List;

import com.gregbugaj.gps.RoutePoint;

public class Example {
	public static void main(String args[]) throws Exception {
		List<RoutePoint> list = GpsManager.getRoutePoints("E:\\COM4_101129_075030.ubx");
		for(RoutePoint point : list){
			System.out.println("========================================");
			System.out.println("经度:"+point.getLongitude());
			System.out.println("纬度:"+point.getLatitude());
			System.out.println("速度:"+point.getSpeedInKM());
			System.out.println("时间:"+point.getTime().toString());
			System.out.println("========================================");
		}
	}
}
