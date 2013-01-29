package com.shine.common.sysmgr.web;

import com.shine.common.sysmgr.entity.SysFreeUrl;
import com.shine.framework.biz.BaseService;
import com.shine.framework.entity.BaseEntity;
import com.shine.framework.web.AjaxAction;

public class SysFreeUrlAction extends AjaxAction<BaseService> {

	private static final long serialVersionUID = -7933616614493551967L;
	
	private SysFreeUrl e = new SysFreeUrl();

	@Override
	public BaseEntity getE() {
		return e;
	}

	@Override
	protected void setE(BaseEntity e) {
		this.e = (SysFreeUrl)e;
	}

}
