package com.shine.sourceflow.model.show;

import java.util.HashMap;
import java.util.Map;
import java.util.TreeMap;

import javax.servlet.http.HttpServletRequest;

import com.shine.framework.core.util.DateUtil;

/**
 * 通用DTO
 */
public class GenericDTO {
	/** 周期选择列表 */
	private Map<Integer, String> statPeriodList;
	
	/** 前N页面选择列表 */
	private Map<Integer, String> topPageList;
	
	/** 当前选择的统计周期类型 */
	private int statPeroid = 4;
	
	/** 查询日期 */
	private String date = DateUtil.getCurrentDate();
	
	/** 要查询的前N页 */
	private int topPageN = 10;
	
	/** 额外参数 */
	private Map<String, String> extraParams = new HashMap<String, String>();
	
	public GenericDTO() {
		this.statPeriodList = new HashMap<Integer, String>();
		this.statPeriodList.put(1, "日报表");
		this.statPeriodList.put(2, "周报表");
		this.statPeriodList.put(3, "月报表");
		this.statPeriodList.put(4, "最近一小时");
		
		this.topPageList = new TreeMap<Integer, String>();
		this.topPageList.put(10, "10");
		this.topPageList.put(20, "20");
		this.topPageList.put(30, "30");
	}
	
	/**
	 * 初始化各参数
	 * 
	 * @param request
	 */
	public void init(HttpServletRequest request) {
		// 查询周期
		String statPeroid = request.getParameter("statPeroid");
		if (statPeroid != null && 
				this.statPeriodList.containsKey(Integer.parseInt(statPeroid))) {
			this.statPeroid = Integer.parseInt(statPeroid);
		}
		// 查询页数
		String topPageN = request.getParameter("topPageN");
		if (topPageN != null && 
				this.topPageList.containsKey(Integer.parseInt(topPageN))) {
			this.topPageN = Integer.parseInt(topPageN);
		}
		// 查询日期
		String date = request.getParameter("date");
		if (date != null) {
			this.date = date;
		}
	}
	
	public Map<Integer, String> getStatPeriodList() {
		return this.statPeriodList;
	}
	
	public Map<Integer, String> getTopPageList() {
		return this.topPageList;
	}
	
	public int getStatPeroid() {
		return statPeroid;
	}
	
	public String getDate() {
		return date;
	}
	
	public int getTopPageN() {
		return topPageN;
	}
	
	public String getExtraParams(String key) {
		return this.extraParams.get(key);
	}
	
	public void setExtraParams(String key, String value) {
		this.extraParams.put(key, value);
	}
}
