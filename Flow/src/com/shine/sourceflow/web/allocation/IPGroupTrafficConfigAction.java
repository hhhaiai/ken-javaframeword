package com.shine.sourceflow.web.allocation;

import com.shine.DBUtil.model.DBModel;
import com.shine.sourceflow.model.allocation.IPGroupConfigDto;
import com.shine.sourceflow.service.allocation.IPGroupConfigService;
import com.shine.sourceflow.web.GenericAction;

public class IPGroupTrafficConfigAction extends GenericAction {
	private static final long serialVersionUID = -5105009842958493356L;
	
	public IPGroupTrafficConfigAction() {
		this.dto = new IPGroupConfigDto();
		this.service = new IPGroupConfigService();
	}
	
	public String getJsonList() {
		this.dto.init(this.request);
		this.dbModels = this.service.list(this.dto);
		DBModel dbModel = this.getDefaultDbModel();
		this.printOutJsonArray(dbModel, this.service.getPagination());
		return null;
	}
	
	/**
	 * 添加IP分组配置
	 * 
	 * @return
	 */
	public String doAdd() {
		this.dto.init(this.request);
		this.service.add(dto);
		return "add_success";
	}
	
	/**
	 * 编辑IP分组配置
	 */
	@Override
	public String edit() {
		this.dto.init(this.request);
		this.dbModels = this.service.listById(dto);
		return DATA_EDIT;
	}
	
	public String doEdit() {
		this.dto.init(request);
		this.service.edit(dto);
		return "edit_success";
	}
	
	/**
	 * 删除IP分组
	 * 
	 * @return
	 */
	public String delete() {
		this.dto.init(this.request);
		this.service.delete(dto);
		return this.getJsonList();
	}
}
