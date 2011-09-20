package com.shine.sourceflow.web.show.detail;

import com.shine.sourceflow.web.GenericAction;

public class DetailGenericAction extends GenericAction {
	private static final long serialVersionUID = -8364262508748947136L;

	/**
	 * 查询数据
	 * 
	 * @return
	 */
	@Override
	public String list() {
		this.dto.init(this.request);
		dbModels = this.service.list(this.dto);
		return DATA_LIST;
	}
}
