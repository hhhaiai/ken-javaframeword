package com.shine.sourceflow.web.allocation;

import com.shine.DBUtil.model.DBModel;
import com.shine.sourceflow.web.GenericAction;

public class ConfigGenericAction extends GenericAction {
	private static final long serialVersionUID = 8586393143309851423L;
	public static final String ADD_SUCCESS = "add_success";
	public static final String EDIT_SUCCESS = "edit_success";

	/**
	 * 枚举数据
	 * 
	 * @return
	 */
	public String getJsonList() {
		this.dto.init(this.request);
		this.dbModels = this.service.list(this.dto);
		DBModel dbModel = this.getDefaultDbModel();
		this.printOutJsonArray(dbModel, this.service.getPagination());
		return null;
	}
	
	/**
	 * 添加配置
	 * 
	 * @return
	 */
	public String doAdd() {
		this.dto.init(this.request);
		this.service.add(dto);
		return ADD_SUCCESS;
	}
	
	/**
	 * 编辑配置(页面跳转)
	 * 
	 * @return
	 */
	@Override
	public String edit() {
		this.dto.init(this.request);
		this.dbModels = this.service.listById(dto);
		return DATA_EDIT;
	}
	
	/**
	 * 编辑配置(数据提交)
	 * 
	 * @return
	 */
	public String doEdit() {
		this.dto.init(request);
		this.service.edit(dto);
		return EDIT_SUCCESS;
	}
	
	/**
	 * 删除配置
	 * 
	 * @return
	 */
	public String delete() {
		this.dto.init(this.request);
		this.service.delete(dto);
		return this.getJsonList();
	}
}
