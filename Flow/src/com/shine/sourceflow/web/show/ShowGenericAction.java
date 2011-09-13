package com.shine.sourceflow.web.show;

import com.shine.sourceflow.web.GenericAction;

public abstract class ShowGenericAction extends GenericAction {
	private static final long serialVersionUID = -101338598930614739L;

	/**
	 * 查询数据
	 * 
	 * @return
	 */
	@Override
	public String list() {
		this.dto.init(this.request);
		this.dbModels = this.service.list(this.dto);
		this.generateCharts();
		return DATA_LIST;
	}
	
	/**
	 * 生成报表数据
	 */
	protected abstract void generateCharts();
}
