package com.shine.framework.web;

import java.util.List;

import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;

import com.shine.framework.biz.BaseService;
import com.shine.framework.dao.util.DefaultPagination;
import com.shine.framework.dao.util.Pagination;
import com.shine.framework.dao.util.QueryAnalyzer;
import com.shine.framework.entity.BaseEntity;
import com.shine.framework.web.json.IJsonFormat;

/**
 * Action基类,包括通用方法
 * @author JiangKunpeng 2012.03.09
 * @version 2012.12.17
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
	
	/**
	 * 设置实体Entity
	 * @return
	 */
	protected abstract void setE(BaseEntity e);
	
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
	
	protected static JsonConfig JsonConfig = null;	//JsonConfig 单例,将过滤掉默认不需要的字段
	
	/**
	 * 获取JsonConfig,将过滤掉默认不需要的字段
	 * @return
	 */
	protected JsonConfig getJsonConfig(){
		if(JsonConfig==null){
			JsonConfig = new JsonConfig();
			JsonConfig.setExcludes(new String[]{"delflag","deltime","existSQL","virtualDelete"});
		}
		return JsonConfig;
	}
	
	/**
	 * 用JSON格式打印List
	 * @param list
	 * @param page
	 */
	protected void printOutJsonList(List list,Pagination page){
		printOutJsonList(list, page, new JsonConfig());
	}
	
	//json格式处理
	protected IJsonFormat jsonformat;
	
	/**
	 * 设置Json格式处理接口实现类
	 * @param jsonformat
	 */
	public void setJsonformat(IJsonFormat jsonformat) {
		this.jsonformat = jsonformat;
	}

	/**
	 * 用JSON格式打印List
	 * @param list
	 * @param page
	 * @param jsonConfig
	 */
	protected void printOutJsonList(List list,Pagination page,JsonConfig jsonConfig){
		printOutJson(jsonformat.list2JsonStr(list, page, jsonConfig));
	}
	
	/**
	 * 用JSON格式打印Object
	 * @param obj
	 * @param jsonConfig
	 */
	protected void printOutJsonObject(Object obj,JsonConfig jsonConfig){
		JSONObject jsonobject = JSONObject.fromObject(obj,jsonConfig);
		printOutJson(jsonobject.toString());
	}
	
	/**
	 * 用JSON格式打印Object
	 * @param obj
	 */
	protected void printOutJsonObject(Object obj){
		printOutJsonObject(obj, new JsonConfig());
	}
	
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
		view();
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
		return UPDATE;
	}
	
	/**
	 * 执行修改 返回Ajax结果
	 */
	public void updateAjax() {
		try{
			service.update(getE());
			printOutText("保存成功");
		}catch(Exception e){
			printOutText("保存失败");
			e.printStackTrace();
		}
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
		setE(service.get(getE()));
		request.setAttribute("entity", getE());
		return VIEW;
	}
	
	/**
	 * 获取Entity实例,以JSON字符串打印出
	 */
	public void viewAjax(){
		BaseEntity e = service.get(getE());
		printOutJsonObject(e, getJsonConfig());
	}
	
}
