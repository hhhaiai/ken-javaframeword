package com.shine.platform.plugin;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * Hibernate hbm配置文件列表
 * @author JiangKunpeng 2013.01.31
 * @version 2013.02.01
 *
 */
public class HbmListBean implements Serializable{
	private static final long serialVersionUID = 2521931227131885236L;
	
	//SessionFactory的ID,用于区分多数据源,如果项目中只有一个SessionFactory则不用设置.
	private String sessionFactoryId;
	private List<String> xmls = new ArrayList<String>();;
	
	public void addXml(String xml){
		xmls.add(xml);
	}
	public String getSessionFactoryId() {
		return sessionFactoryId;
	}
	public void setSessionFactoryId(String sessionFactoryId) {
		this.sessionFactoryId = sessionFactoryId;
	}
	public List<String> getXmls() {
		return xmls;
	}
}
