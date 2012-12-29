package com.shine.framework.web;

import java.util.List;

import com.shine.framework.biz.BaseService;
import com.shine.framework.dao.util.DefaultPagination;
import com.shine.framework.dao.util.Pagination;
import com.shine.framework.dao.util.QueryAnalyzer;
import com.shine.framework.entity.BaseEntity;
import com.shine.framework.entity.PersistResult;

/**
 * Ajax 增删改查 Action基类,适用于通过Ajax方式取数据的模块
 * @author JiangKunpeng 2012.12.28
 * @version 2012.12.29
 * @param <SERVICE>	增删改查Service基类
 */
public abstract class AjaxAction<SERVICE extends BaseService> extends BaseAction<SERVICE>{

	private static final long serialVersionUID = -3379271855697032490L;
	
	/**
	 * 分页查询 返回JSON格式结果
	 * 
	 */
	public void list() {
		try{
			QueryAnalyzer analyzer = new QueryAnalyzer();
			analyzer.setEntity(getE());
			Pagination page = new DefaultPagination();
			page.init(extor.getIntValue("start"), extor.getIntValue("limit"));
			analyzer.setPage(page);
			extor.buildQueryItem(analyzer);
			List list = service.list(analyzer);
			printOutJsonList(list, page, getJsonConfig());
		}catch(Exception e){
			e.printStackTrace();
		}
	}
	
	/**
	 * 执行新增 返回XML格式结果
	 */
	public void save() {
		try{
			printOutText(service.save(getE()).toJson());
		}catch(Exception e){
			printOutText(new PersistResult(PersistResult.ERROR, PersistResult.MSG_ERROR).toJson());
			e.printStackTrace();
		}
	}
	
	/**
	 * 执行修改 返回Ajax结果
	 */
	public void update() {
		try{
			printOutText(service.update(getE()).toJson());
		}catch(Exception e){
			printOutText(new PersistResult(PersistResult.ERROR, PersistResult.MSG_ERROR).toJson());
			e.printStackTrace();
		}
	}
	
	/**
	 * 获取Entity实例,以JSON字符串打印出
	 */
	public void viewAjax(){
		BaseEntity e = service.get(getE());
		printOutJsonObject(e, getJsonConfig());
	}
	
	/**
	 * 执行删除
	 * 
	 * @return
	 */
	public void delete() {
		PersistResult pr = null;
		try{
			pr = doDelete();
			printOutText(pr.toJson());
		}catch(Exception e){
			printOutText(new PersistResult(PersistResult.ERROR, PersistResult.MSG_ERROR).toJson());
			e.printStackTrace();
		}
	}

}
