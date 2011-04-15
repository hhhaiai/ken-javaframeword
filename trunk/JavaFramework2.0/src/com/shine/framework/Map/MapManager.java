package com.shine.framework.Map;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.text.MessageFormat;

import com.shine.framework.core.util.HtmlUtil;

public class MapManager {

	public final static double PI = 3.14159265354;
	private final static double D2R = 0.017453;
	private final static double a2 = 6378137.0;
	private final static double e2 = 0.006739496742337;

	/**
	 * 知道经纬计算距离
	 * 
	 * @param lng1
	 * @param lat1
	 * @param lng2
	 * @param lat2
	 * @return
	 */
	public static double Distance(double lng1, double lat1, double lng2,
			double lat2) {
		if (lng1 == lng2 && lat1 == lat2) {
			return 0.0;
		} else {
			double fdLambda = (lng1 - lng2) * D2R;
			double fdPhi = (lat1 - lat2) * D2R;
			double fPhimean = ((lat1 + lat2) / 2.0) * D2R;
			double fTemp = 1 - e2 * (Math.pow(Math.sin(fPhimean), 2));
			double fRho = (a2 * (1 - e2)) / Math.pow(fTemp, 1.5);
			double fNu = a2
					/ (Math.sqrt(1 - e2
							* (Math.sin(fPhimean) * Math.sin(fPhimean))));
			double fz = Math.sqrt(Math.pow(Math.sin(fdPhi / 2.0), 2)
					+ Math.cos(lat2 * D2R) * Math.cos(lat1 * D2R)
					* Math.pow(Math.sin(fdLambda / 2.0), 2));
			fz = 2 * Math.asin(fz);
			double fAlpha = Math.cos(lat2 * D2R) * Math.sin(fdLambda) * 1
					/ Math.sin(fz);
			fAlpha = Math.asin(fAlpha);
			double fR = (fRho * fNu)
					/ ((fRho * Math.pow(Math.sin(fAlpha), 2)) + (fNu * Math
							.pow(Math.cos(fAlpha), 2)));
			return fz * fR;
		}
	}

	/**
	 * 根据经纬获取google map该点的数据 英文
	 * 
	 * @param lng
	 * @param lat
	 * @return
	 */
	public static String getGoogleMapXml(double lng, double lat) {
		try {
			return HtmlUtil
					.getUrlString("http://maps.google.com/maps/geo?output=xml&key=abcdefg&q="
							+ lng + "," + lat);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	/**
	 * 根据经纬获取google map该点的数据 中文
	 * 
	 * @param lng
	 * @param lat
	 * @return
	 */
	public static String getGoogleMapXmlCn(double lng, double lat) {
		try {
			return HtmlUtil
					.getUrlString("http://ditu.google.com/maps/geo?output=xml&key=abcdefg&q="
							+ lng + "," + lat);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	/**
	 * 根据地點名稱的搜索出该地图的经纬 mapkey可以为null或者“”
	 * 
	 * 
	 * @param address
	 * @param mapKey
	 * @return
	 */
	public static String getLatlng(String address, String mapKey) {
		String ret = "";
		if (address != null && !address.equals("")) {
			try {
				address = URLEncoder.encode(address, "UTF-8");// 进行这一步是为了避免乱码
			} catch (UnsupportedEncodingException e1) {
			}
			// q 是查询的目标地址，output 是响应格式，key 是要使用此 Web 服务的关键字字符串
			// 在此响应内，200 是 HTTP 状态代码，表明解析成功；4 是精度常量；41.879535 是经度；-87.624333
			// 是纬度。

			String[] arr = new String[4];
			arr[0] = address;
			arr[1] = "xml";
			arr[2] = "true";
			if (mapKey == null || mapKey.length() == 0)
				arr[3] = "abcdef";
			else
				arr[3] = mapKey;
			String url = MessageFormat
					.format(
							"http://maps.google.com/maps/geo?q={0}&output={1}&sensor={2}&key={3}",
							arr);
			ret = HtmlUtil.getUrlString(url);
		}
		return ret;
	}

	/**
	 * 消除天朝偏移
	 * 
	 * 偏移修正接口：
	 * http://www.anttna.com/goffset/goffset1.php?lat=纠偏前的纬度值&lon=纠偏前的经度值
	 * 
	 * @param lng
	 * @param lat
	 * @return
	 */
	public static String[] repairLatlng(double lng, double lat) {
		try {
			StringBuffer url = new StringBuffer();
			url.append("http://www.anttna.com/goffset/goffset1.php?lat=");
			url.append(lat);
			url.append("&lon=");
			url.append(lng);

			String ret = HtmlUtil.getUrlString(url.toString());
			url = null;
			if (ret.indexOf(",") != -1) {
				String sp[]=ret.split(",");
				sp[0]=sp[0].trim();
				sp[1]=sp[1].trim();
				return sp;
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

}
