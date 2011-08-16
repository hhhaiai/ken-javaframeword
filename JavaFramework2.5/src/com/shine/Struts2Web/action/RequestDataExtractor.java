package com.shine.Struts2Web.action;

import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

/**
 * 提取 request
 * 
 * @author viruscodecn@gmail.com
 */
@SuppressWarnings("unchecked")
final public class RequestDataExtractor {
	private HttpServletRequest request;

	/**
	 * 注入request
	 * 
	 * @param request
	 */
	public RequestDataExtractor(HttpServletRequest request) {
		this.request = request;
	}

	/**
	 * 获取数据
	 * 
	 * @param para
	 * @return
	 */
	public String getValue(final String para) {
		return request.getParameter(para);
	}

	/**
	 * 获取数组
	 * 
	 * @param para
	 * @return
	 */
	public String[] getArrayValue(final String para) {
		return request.getParameterValues(para);
	}

	/**
	 * 获取int数据
	 * 
	 * @param para
	 * @return
	 */
	public int getIntValue(final String para) {
		int result = -1;
		String temp = request.getParameter(para);
		if (temp != null && temp.length() != 0)
			result = Integer.parseInt(temp);
		return result;
	}

	/**
	 * 获取long数据
	 * 
	 * @param para
	 * @return
	 */
	public long getLongValue(final String para) {
		long result = -1L;
		String temp = request.getParameter(para);
		if (temp != null && temp.length() != 0)
			result = Long.parseLong(temp);
		return result;
	}

	/**
	 * 获取浮点数据
	 * 
	 * @param para
	 * @return
	 */
	public float getFloatValue(final String para) {
		float result = -1F;
		String temp = request.getParameter(para);
		if (temp != null && temp.length() != 0) {
			result = Float.parseFloat(temp);
		}
		return result;
	}

	/**
	 * 
	 * @param para
	 * @return
	 */
	public double getDoubleValue(final String para) {
		double result = -1D;
		String temp = request.getParameter(para);
		if (temp != null && temp.length() != 0) {
			result = Double.parseDouble(temp);
		}
		return result;
	}

	/**
	 * 获取所有数据map
	 * 
	 * @return
	 */
	public Map<String, String> getParas() {
		HashMap<String, String> map = new HashMap<String, String>();
		for (Enumeration em = request.getParameterNames(); em.hasMoreElements();) {
			String name = (String) (em.nextElement());
			map.put(name, request.getParameter(name));
		}
		return map;
	}

}