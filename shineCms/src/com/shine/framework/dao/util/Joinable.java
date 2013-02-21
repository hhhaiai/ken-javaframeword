package com.shine.framework.dao.util;

/**
 * 可关联查询的
 * @author JiangKunpeng 2013.02.21
 * @version 2013.02.21
 * 
 */
public abstract class Joinable{
	protected String name;		//字段名
	protected boolean join = false;	//是否关联表
	
	public String getName(){
		return name;
	}
	public boolean isJoin(){
		return join;
	}
	
	public String[] getJoins(){
		return name.split("\\.");
	}
	
	public void setName(String name) {
		if(name.contains("."))
			join = true;
		this.name = name;
	}
}
