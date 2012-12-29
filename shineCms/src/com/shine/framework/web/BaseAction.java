package com.shine.framework.web;

import java.util.List;

import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;

import com.shine.framework.biz.BaseService;
import com.shine.framework.dao.util.Pagination;
import com.shine.framework.entity.BaseEntity;
import com.shine.framework.entity.PersistResult;
import com.shine.framework.web.json.IJsonFormat;

/**
 * 针对通用增删改查等方法写的Action抽象类,目前由AjaxAction和OrdinaryAction继承.
 * @author JiangKunpeng 2012.03.09
 * @version 2012.12.29
 * @param <SERVICE>	增删改查Service基类
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
	protected PersistResult doDelete() {
		PersistResult pr = null;
		String[] ids = null;
		try{
			ids = getSeparateArray(COMMONPK);
			int len = 0;
			if(ids!=null&&(len=ids.length)>0){
				if(len==1)
					pr = service.delete(getE(), ids[0]);
				else
					pr = service.delete(getE(), ids);
			}else{
				pr = new PersistResult(PersistResult.FAILURE, "后台没获取到要删除的记录");
			}
		}finally{
			ids = null;
		}
		return pr;
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
	
}
