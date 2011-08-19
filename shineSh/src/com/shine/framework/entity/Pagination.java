package com.shine.framework.entity;

/**
 * 分页实体
 * 
 * @author JiangKunpeng 2010-10-11
 * @version 2011-05-04
 */
public class Pagination {
	private int pageSize = 0; 		// 每页记录数
	private int totalRecord = 0; 	// 总记录数
	private int currentPage = 1; 	// 当前页码
	private int minNum = 0; 		// 本页开始索引
	private int maxNum = 0; 		// 本页结束索引
	private int totalPage = 0; 		// 总页数

	/**
	 * 构建分页对象
	 * @param currentPage	当前页码
	 * @param pageSize		每页记录数
	 */
	public Pagination(int currentPage, int pageSize) {
		this.currentPage = currentPage;
		this.pageSize = pageSize;
	}
	
	/**
	 * 构建分页对象,默认每页20条记录
	 * @param currentPage	当前页码
	 */
	public Pagination(int currentPage){
		this(currentPage, 20);
	}
	
	public Pagination(){
	}
	
	
	/**
	 * 整理数据,使数据准确
	 */
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
		
		minNum = (currentPage - 1) * pageSize;

		if (totalRecord == 0) {
			minNum = 0;
			maxNum = 0;
			totalPage = 0;
			return;
		} else if (currentPage == totalPage && totalRecord % pageSize != 0)
			maxNum = totalRecord;
		else
			maxNum = minNum + pageSize;

		minNum++;
	}

	public void setTotalRecord(int totalRecord) {
		this.totalRecord = totalRecord;
		fix();
	}
	public int getPageSize() {
		return pageSize;
	}
	public void setPageSize(int pageSize) {
		this.pageSize = pageSize;
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
	public int getMinNum() {
		return minNum;
	}
	public void setMinNum(int minNum) {
		this.minNum = minNum;
	}
	public int getMaxNum() {
		return maxNum;
	}
	public void setMaxNum(int maxNum) {
		this.maxNum = maxNum;
	}
	public int getTotalPage() {
		return totalPage;
	}
	public void setTotalPage(int totalPage) {
		this.totalPage = totalPage;
	}
}
