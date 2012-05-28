package com.shine.framework.dao.util;

/**
 * 通用分页属性和方法
 * @author JiangKunpeng 2012.05.28
 * @version 2012.05.28
 */
public abstract class BasePagination implements Pagination{
	protected int pageSize = 0; 		// 每页记录数
	protected int totalRecord = 0; 		// 总记录数
	protected int currentPage = 1; 		// 当前页码
	protected int start = 0; 			// 本页开始索引
	protected int end = 0; 			// 本页结束索引
	protected int totalPage = 0; 		// 总页数
	
	public void fix(){
		if(totalRecord < 0)
			totalRecord = 0;
		if(currentPage < 1)
			currentPage = 1;
		
		totalPage = (totalRecord + pageSize - 1) / pageSize;
		
		if (totalPage < 1)
			totalPage = 1;

		if (currentPage > totalPage)
			currentPage = totalPage;
		
		start = (currentPage - 1) * pageSize;

		if (totalRecord == 0) {
			start = 0;
			end = 0;
			totalPage = 0;
			return;
		} else if (currentPage == totalPage && totalRecord % pageSize != 0)
			end = totalRecord;
		else
			end = start + pageSize;
	}
	
	public void setTotalRecord(int totalRecord) {
		this.totalRecord = totalRecord;
		fix();
	}
	public int getPageSize() {
		return pageSize;
	}
	public int getTotalRecord() {
		return totalRecord;
	}
	public int getCurrentPage() {
		return currentPage;
	}
	public void setCurrentPage(int currentPage) {
		this.currentPage = currentPage;
	}
	public int getStart() {
		return start;
	}
	public int getEnd() {
		return end;
	}
	public int getTotalPage() {
		return totalPage;
	}
}
