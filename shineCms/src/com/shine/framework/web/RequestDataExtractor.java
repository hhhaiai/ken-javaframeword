package com.shine.framework.web;

import java.util.ArrayList;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
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
	    int len = paraStr.length();
	    if(len>0)
	    	paraStr.delete(len-1, len);
	    return paraStr.toString();
	}
	
	/**
	 * 萃取并构建查询条件
	 * @param analyzer
	 */
	public void buildQueryItem(final QueryAnalyzer analyzer){
		Enumeration<String> em = request.getParameterNames();
		List<String> params = new ArrayList<String>();
		Map<String, String> ops = new HashMap<String, String>();
		Map<String, String> values = new HashMap<String, String>();
		Map<String, String> types = new HashMap<String, String>();
		while(em.hasMoreElements()){
			String e = em.nextElement();
			//字段参数
			if(e.startsWith("Q_")){
				String pa = e.substring(2);
				String name = null;
				String op = null;
				int len = pa.length();
				if(pa.lastIndexOf("_")==len-3){
					name = pa.substring(0,len-3);
					op = pa.substring(len-2,len);
				}else{
					name = pa;
				}
				String value = request.getParameter(e);
				if(value!=null&&!"".equals(value)){
					params.add(name);
					values.put(name, value);
					if(op!=null)
						ops.put(name, op);
				}
			}
			//类型
			if(e.startsWith("T_")){
				String value = request.getParameter(e);
				if(value!=null&&!"".equals(value))
					types.put(e.substring(2), value);
			}
		}
		if(!values.isEmpty()){
			for(String name:params){
				String op = ops.get(name);
				String type = types.get(name);
				if(op==null)
					op = "eq";
				if(type==null)
					type = "string";
				analyzer.addItem(name, values.get(name), op, type);
			}
		}
		params = null;
		ops = null;
		values = null;
		types = null;
	}
}
