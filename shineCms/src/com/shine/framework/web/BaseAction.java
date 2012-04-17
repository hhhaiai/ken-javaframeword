package com.shine.framework.web;

import java.util.List;

import net.sf.json.JSONArray;
import net.sf.json.JsonConfig;

import com.shine.framework.biz.BaseService;
import com.shine.framework.dao.util.Pagination;
import com.shine.framework.dao.util.QueryAnalyzer;
import com.shine.framework.entity.BaseEntity;

/**
 * Action基类,包括通用方法
 * @author JiangKunpeng 2012.03.09
 * @version 2012.03.09
 * @param <SERVICE>	对应的业务实现类
 */
public abstract class BaseAction<SERVICE extends BaseService> extends GenericAction{

	private static final long serialVersionUID = -6092656513267551419L;
	
	protected static final String ENTER = "enter";
	protected static final String LIST = "list";
	protected static final String TOADD = "toAdd";
	protected static final String TOEDIT = "toEdit";
	protected static final String SAVE = "save";
	protected static final String UPDATE = "update";
	protected static final String DELETE = "delete";
	protected static final String VIEW = "view";
	
	/**
	 * 获取Entity
	 * 
	 * @return
	 */
	public abstract BaseEntity getE();
	
	// Service
	protected SERVICE service;

	// 注入Service
	public void setService(SERVICE service) {
		this.service = service;
	}
	
	/**
	 * 进入模块
	 * 
	 * @return
	 */
	public String enter() {

		return ENTER;
	}
	
	/**
	 * 分页列表
	 * 
	 * @return
	 */
	public String list() {
		return LIST;
	}

	/**
	 * 分页查询 返回JSON格式结果
	 * 
	 */
	public void listJSON() {
		try{
			QueryAnalyzer analyzer = new QueryAnalyzer();
			analyzer.setClazz(this.getE().getClass());
			Pagination page = new Pagination(1,15);
			analyzer.setPage(page);
			List list = service.list(analyzer);
			printOutJsonList(list, page);
		}catch(Exception e){
			e.printStackTrace();
		}
	}
	
	/**
	 * 用JSON格式打印List
	 * @param list
	 * @param page
	 */
	protected void printOutJsonList(List list,Pagination page){
		printOutJsonList(list, page, new JsonConfig());
	}
	
	/**
	 * 用JSON格式打印List
	 * @param list
	 * @param page
	 * @param jsonConfig
	 */
	protected void printOutJsonList(List list,Pagination page,JsonConfig jsonConfig){
		StringBuffer jsonStr = new StringBuffer(200);
		jsonStr.append("{").append("\"total\":").append(page.getTotalRecord()).append(",\"rows\":");
		jsonStr.append(list2Json(list, jsonConfig));
		jsonStr.append("}");
		printOutText(jsonStr.toString());
	}
	
	/**
	 * List转成Json数组字符串
	 * @param list
	 * @param jsonConfig
	 * @return
	 */
	protected String list2Json(List list,JsonConfig jsonConfig){
		if(list==null)
			return NullJsonArray;
		JSONArray jsonarry = JSONArray.fromObject(list, jsonConfig);
		return jsonarry.toString();
	}
	protected static final String NullJsonArray = "[]";
	
	/**
	 * 所有记录列表
	 * 
	 * @return
	 */
	public String loadAll() {
		return LIST;
	}
	
	/**
	 * 进入新增
	 * 
	 * @return
	 */
	public String toAdd() {
		return TOADD;
	}

	/**
	 * 进入修改
	 * 
	 * @return
	 */
	public String toEdit() {
		return TOEDIT;
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
	 * 执行新增 返回XML格式结果
	 */
	public void saveAjax() {
		try{
			service.save(getE());
			printOutText("保存成功");
		}catch(Exception e){
			printOutText("保存失败");
			e.printStackTrace();
		}
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
	 * 执行修改 返回Ajax结果
	 */
	public void updateAjax() {
		
	}
	
	/**
	 * 删除
	 * 
	 * @return
	 */
	public void delete() {
		String[] ids = extor.getArrayValue("id");
		if(ids!=null)
			service.delete(getE(), ids);
	}
	
	/**
	 * 查看详细
	 * 
	 * @return
	 */
	public String view() {
		request.setAttribute("entity", service.get(getE()));
		return VIEW;
	}
	
}
