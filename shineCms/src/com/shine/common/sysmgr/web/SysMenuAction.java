package com.shine.common.sysmgr.web;

import com.shine.common.sysmgr.entity.SysMenu;
import com.shine.framework.biz.BaseService;
import com.shine.framework.entity.BaseEntity;
import com.shine.framework.web.AjaxAction;

public class SysMenuAction extends AjaxAction<BaseService>{

	private static final long serialVersionUID = -8274394737739352L;
	
	private SysMenu e = new SysMenu(); 

	@Override
	public BaseEntity getE() {
		return e;
	}

	@Override
	protected void setE(BaseEntity e) {
		this.e = (SysMenu)e;
	}

}
