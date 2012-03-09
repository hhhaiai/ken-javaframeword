package com.shine.framework.web;

import java.util.Enumeration;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.shine.framework.dao.util.QueryAnalyzer;

/**
 * Request数据获取器
 * @author JiangKunpeng 2012.03.09
 * @version 2012.03.09
 */
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
			map.put(name,  request.getParameter(name));
		}
		return map;
	}
	
	public String getParaString(){
	    StringBuffer paraStr = new StringBuffer(100);
	    for (Enumeration em = request.getParameterNames(); em.hasMoreElements();) {
			String name = (String) (em.nextElement());
			paraStr.append(name).append("=");			
			paraStr.append(request.getParameter(name));
			paraStr.append("&");
	    }
	    paraStr.delete(paraStr.length() - 1,paraStr.length());
	    
	    return paraStr.toString();
	}
	
	/**
	 * 构建查询条件分析器
	 * @return
	 */
	public QueryAnalyzer buildQueryFilter(){
		QueryAnalyzer analyzer = new QueryAnalyzer();
		return analyzer;
	}
}
