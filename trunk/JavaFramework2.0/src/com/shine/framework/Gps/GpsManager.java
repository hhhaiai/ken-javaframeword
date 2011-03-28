package com.shine.framework.Gps;

import java.io.File;
import java.util.List;

import com.gregbugaj.gps.GPSParser;
import com.gregbugaj.gps.Route;
import com.gregbugaj.gps.RoutePoint;

public class GpsManager {
	/**
	 * 获取gps route 实例
	 * 
	 * @param filePath
	 * @return
	 * @throws Exception
	 */
	public static Route getRoute(String filePath) throws Exception {
		GPSParser app = new GPSParser();
		File in = new File(filePath);
		app.load(in);
		app.parse();
		return app.getRoute();
	}

	/**
	 * 获取每个点的实例
	 * 
	 * @param filePath
	 * @return
	 * @throws Exception
	 */
	public static List<RoutePoint> getRoutePoints(String filePath)
			throws Exception {
		return getRoute(filePath).getPoints();
	}
}
