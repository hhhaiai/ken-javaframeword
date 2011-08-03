package com.shine.framework.Gps;

import java.io.File;
import java.util.List;

import com.gregbugaj.gps.GPSParser;
import com.gregbugaj.gps.Route;
import com.gregbugaj.gps.RoutePoint;

/**
 * 获取gps数据基于0813协议
 * 
 * @author viruscodecn@gmail.com
 * @project JavaFramework 2.0 2011-4-26
 */
public class GpsManager {
	/**
	 * 获取gps route 实例
	 * 
	 * @param filePath
	 * @return
	 * @throws Exception
	 */
	public static Route getRoute(String filePath) throws Exception {
		return getRoute(new File(filePath));
	}

	/**
	 * 获取gps route 实例
	 * 
	 * @param file
	 * @return
	 * @throws Exception
	 */
	public static Route getRoute(File file) throws Exception {
		GPSParser app = new GPSParser();
		app.load(file);
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

	/**
	 * 获取每个点的实例
	 * 
	 * @param file
	 * @return
	 * @throws Exception
	 */
	public static List<RoutePoint> getRoutePoints(File file) throws Exception {
		return getRoute(file).getPoints();
	}

//	public static List<RoutePoint> getRoutePointsByUrl(String url)
//			throws Exception {
//		String result = HtmlUtil.getUrlString(url);
//		FileUtil.createWordFile("E:\\temp.ubx", result);
//		return getRoutePoints("E:\\temp.ubx");
//	}
}
