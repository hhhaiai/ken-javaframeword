package com.shine.framework.web;

import java.util.List;

import com.shine.framework.biz.BaseService;
import com.shine.framework.dao.util.DefaultPagination;
import com.shine.framework.dao.util.Pagination;
import com.shine.framework.dao.util.QueryAnalyzer;

/**
 * 传统的增删改查Action基类,适用于统计报表等页面,或者不使用Ajax的模块
 * @author JiangKunpeng 2012.12.28
 * @version 2013.02.18
 * @param <SERVICE>	增删改查Service基类
 */
public abstract class OrdinaryAction<SERVICE extends BaseService> extends BaseAction<SERVICE>{

	private static final long serialVersionUID = 6168556773446335982L;
	
	/**
	 * 分页列表
	 * 
	 * @return
	 */
	public String list() {
		QueryAnalyzer analyzer = new QueryAnalyzer();
		analyzer.setEntity(getE());
		Pagination page = new DefaultPagination();
		page.init(extor.getIntValue("start"), extor.getIntValue("limit"));
		analyzer.setPage(page);
		extor.buildQueryItem(analyzer);
		List list = service.list(analyzer);
		request.setAttribute(LIST, list);
		request.setAttribute("page", page);
		return LIST;
	}
	
	/**
	 * 所有记录列表
	 * 
	 * @return
	 */
	public String loadAll() {
		QueryAnalyzer analyzer = new QueryAnalyzer();
		analyzer.setEntity(getE());
		extor.buildQueryItem(analyzer);
		List list = service.list(analyzer);
		request.setAttribute(LIST, list);
		return LIST;
	}
	
	/**
	 * 执行新增
	 * 
	 * @return
	 */
	public String save() {
		service.save(getE());
		return SAVE;
	}
	
	/**
	 * 执行修改
	 * 
	 * @return
	 */
	public String update() {
		service.update(getE());
		return UPDATE;
	}
	
	/**
	 * 执行删除
	 * @return
	 */
	public String delete() {
		doDelete();
		return DELETE;
	}
	
}
