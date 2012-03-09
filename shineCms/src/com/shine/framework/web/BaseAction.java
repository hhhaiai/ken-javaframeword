package com.shine.framework.web;

import com.shine.framework.biz.BaseService;
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
	public String delete() {
		
		return DELETE;
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
