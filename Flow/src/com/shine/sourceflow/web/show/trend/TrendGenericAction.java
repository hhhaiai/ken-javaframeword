package com.shine.sourceflow.web.show.trend;

import com.shine.sourceflow.web.GenericAction;

public abstract class TrendGenericAction extends GenericAction {
	private static final long serialVersionUID = -550264818513963949L;
	
	@Override
	public String list() {
		this.dto.init(request);
		dbModels = this.service.list(this.dto);
		this.generateCharts();
		return DATA_LIST;
	}
	
	/**
	 * 生成报表数据
	 */
	protected abstract void generateCharts();
}
