package com.shine.framework.dao.util;

/**
 * 查询分页器
 * @author JiangKunpeng 2013.02.18
 * @version 2013.02.21
 *
 */
public class QuerySorter extends Joinable{
	private boolean desc = false;	//是否倒序
	
	public QuerySorter(){
	}
	
	public QuerySorter(String field){
		this(field, false);
	}
	
	public QuerySorter(String name,boolean desc){
		setName(name);
		this.desc = desc;
	}
	
	public boolean isDesc() {
		return desc;
	}
	public void setDesc(boolean desc) {
		this.desc = desc;
	}
}
