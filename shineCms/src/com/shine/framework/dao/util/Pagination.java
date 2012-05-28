package com.shine.framework.dao.util;

/**
 * 分页接口
 * 
 * @author JiangKunpeng 2012.05.28
 * @version 2012.05.28
 */
public interface Pagination {
	
	/**
	 * 设置初始化参数
	 * @param num1
	 * @param num2
	 */
	public void init(int num1,int num2);
	
	/**
	 * 整理结果数据,使属性准确(设置结果总数后调用)
	 */
	public void fix();

	public void setTotalRecord(int totalRecord);
	public int getPageSize();
	public int getTotalRecord();
	public int getCurrentPage();
	public int getStart();
	public int getEnd();
	public int getTotalPage();
}
