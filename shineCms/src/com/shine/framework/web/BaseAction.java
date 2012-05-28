package com.shine.framework.web;

import java.util.List;

import net.sf.json.JSONArray;
import net.sf.json.JsonConfig;

import com.shine.framework.biz.BaseService;
import com.shine.framework.dao.util.DefaultPagination;
import com.shine.framework.dao.util.Pagination;
import com.shine.framework.dao.util.QueryAnalyzer;
import com.shine.framework.entity.BaseEntity;

/**
 * Action基类,包括通用方法
 * @author JiangKunpeng 2012.03.09
 * @version 2012.05.28
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
			System.out.println(extor.getParaString());
			QueryAnalyzer analyzer = new QueryAnalyzer();
			analyzer.setEntity(getE());
			Pagination page = new DefaultPagination();
			page.init(extor.getIntValue("start"), extor.getIntValue("limit"));
			analyzer.setPage(page);
			extor.buildQueryItem(analyzer);
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
	
	//逗号分隔符
	final static String COMMA = ",";
	/**
	 * 获取被逗号分隔的数组
	 * @param paramName
	 * @return
	 */
	protected String[] getSeparateArray(final String paramName){
		String[] vs = null;
		String v = extor.getValue(paramName);
		if(v!=null)
			vs = v.split(COMMA);
		return vs;
	}
	
	//统一主键名（在请求中传入）
	final static String COMMONPK = "id";
	/**
	 * 删除
	 * 
	 * @return
	 */
	public void delete() {
		try{
			String[] ids = getSeparateArray(COMMONPK);
			int len = 0;
			if(ids!=null&&(len=ids.length)>0){
				if(len==1)
					service.delete(getE(), ids[0]);
				else
					service.delete(getE(), ids);
			}else{
				printOutText("没选择要删除的记录");
			}
			printOutText("删除成功");
		}catch(Exception e){
			printOutText("删除失败");
			e.printStackTrace();
		}
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
