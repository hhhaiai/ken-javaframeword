package com.gm.framework.util;
import java.io.UnsupportedEncodingException;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

/**
 * extract data from request
 * @author afunms
 * @version Sourceview4.0 2009.12.26
 */
@SuppressWarnings("unchecked")
final public class RequestDataExtractor {
	private HttpServletRequest request;

	public RequestDataExtractor(HttpServletRequest request) {
		this.request = request;
	}

	public String getValue(final String para) {
		return request.getParameter(para);
	}

	public String[] getArrayValue(final String para) {
		return request.getParameterValues(para);
	}

	public int getIntValue(final String para) {
		int result = -1;
		String temp = request.getParameter(para);
		if (temp != null && temp.length() != 0)
			result = Integer.parseInt(temp);
		return result;
	}

	public long getLongValue(final String para) {
		long result = -1L;
		String temp = request.getParameter(para);
		if (temp != null && temp.length() != 0)
			result = Long.parseLong(temp);
		return result;
	}

	public float getFloatValue(final String para) {
		float result = -1F;
		String temp = request.getParameter(para);
		if (temp != null && temp.length() != 0) {
			result = Float.parseFloat(temp);
		}
		return result;
	}

	public double getDoubleValue(final String para) {
		double result = -1D;
		String temp = request.getParameter(para);
		if (temp != null && temp.length() != 0) {
			result = Double.parseDouble(temp);
		}
		return result;
	}

	public int getCurrentPage() {
		int curPage = 1;
		try {
			String jp = getValue("jp");
			if (jp == null || "".equals(jp))
				jp = (String) request.getSession().getAttribute("current_page");
			else
				request.getSession().setAttribute("current_page", jp);
			if (jp == null || "".equals(jp))
				curPage = 1;
			else
				curPage = Integer.parseInt(jp);
		} catch (NumberFormatException e) {
			curPage = 1;
		}
		return curPage;
	}

	public int getPerPage() {
		String perPageStr = getValue("perPage");
		if (perPageStr == null) {
			Object obj = request.getSession().getAttribute("perPage");
			if (obj != null)
				perPageStr = obj.toString();
		} else
			request.getSession().setAttribute("perPage", perPageStr);

		if (perPageStr == null)
			return 20;
		else
			return Integer.parseInt(perPageStr);
	}

	public void transfer(Map serviceResultMap) {
		Iterator keys = serviceResultMap.keySet().iterator();
		while (keys.hasNext()) {
			String key = (String) keys.next();
			request.setAttribute(key, serviceResultMap.get(key));
		}
		serviceResultMap = null;
	}
	
	public Map<String,String> getParas(){
		HashMap<String,String> map = new HashMap<String,String>();
		for (Enumeration em = request.getParameterNames(); em.hasMoreElements();) {
			String name = (String) (em.nextElement());
			map.put(name,request.getParameter(name));
		}
		return map;
	}
}
