package com.shine.framework.dao.util;

/**
 * 默认分页实体
 * @author JiangKunpeng 2012.05.28
 * @version 2012.05.28
 */
public class DefaultPagination extends BasePagination{
	
	private static int DEFAULT_PAGESIZE = 20;
	
	/**
	 * 初始化参数
	 * @param start 起始序号,从0开始
	 * @param limit 每页数量,小于1则用默认只
	 */
	public void init(int start,int limit){
		if(start<0)
			start=0;
		if(limit<1)
			limit=DEFAULT_PAGESIZE;
		this.start = start;
		this.pageSize = limit;
		this.currentPage = (start+limit)/limit;
	}
}
