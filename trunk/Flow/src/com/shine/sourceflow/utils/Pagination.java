package com.shine.sourceflow.utils;

/*
 * 分页类，记录分页和数据总记录等信息
 */
public class Pagination {
	/** 默认每页显示20条 */
	public static final int PERPAGE = 20;
	
	/** 每页显示多少条记录 */
	private int perPage;
	
	/** 总记录数 */
	private int totalRecord;
	
	/** 当前页数 */
	private int currentPage;
	
	/** 总页数 */
	private int totalPage;
	
	/** 记录开始位置 */
	private int recordStart;
	
	/** 记录结束位置 */
	private int recordEnd;
	
	public Pagination(int currentPage, int totalRecord) {
		this(PERPAGE, currentPage, totalRecord);
	}

	public Pagination(int perPage, int currentPage, int totalRecord) {
		this.perPage = perPage;
		this.totalRecord = totalRecord;
		this.currentPage = currentPage;
		this.adjust();
	}
	
	/**
	 * 调整各参数
	 */
	private void adjust() {
		if (this.currentPage <= 0) {
			this.currentPage = 1;
		}
		this.totalPage = (this.totalRecord + this.perPage - 1) / this.perPage;
		if (this.totalPage == 0) {
			this.totalPage = 1;
		}
		if (this.totalPage < this.currentPage) {
			this.currentPage = this.totalPage;
		}
		
		this.recordStart = (this.currentPage - 1) * this.perPage;
		if (this.totalRecord == 0) {
			this.recordStart = 0;
			this.recordEnd = 0;
			return;
		} else if (this.totalRecord % this.perPage != 0 
				&& this.currentPage == this.totalPage) {
			this.recordEnd = this.totalRecord;
		} else {
			this.recordEnd = this.recordStart + perPage;
		}
		this.recordStart++;
	}
	
	public int getPerPage() {
		return perPage;
	}
	
	public void setPerPage(int perPage) {
		this.perPage = perPage;
	}
	
	public int getTotalRecord() {
		return totalRecord;
	}
	
	public void setTotalRecord(int totalRecord) {
		this.totalRecord = totalRecord;
	}
	
	public int getCurrentPage() {
		return currentPage;
	}
	
	public void setCurrentPage(int currentPage) {
		this.currentPage = currentPage;
	}
	
	public int getTotalPage() {
		return totalPage;
	}
	
	public void setTotalPage(int totalPage) {
		this.totalPage = totalPage;
	}
	
	public int getRecordStart() {
		return recordStart;
	}

	public void setRecordStart(int recordStart) {
		this.recordStart = recordStart;
	}

	public int getRecordEnd() {
		return recordEnd;
	}

	public void setRecordEnd(int recordEnd) {
		this.recordEnd = recordEnd;
	}
}
