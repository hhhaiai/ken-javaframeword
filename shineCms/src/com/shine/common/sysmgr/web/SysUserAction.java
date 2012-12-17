package com.shine.common.sysmgr.web;

import com.shine.common.sysmgr.entity.SysUser;
import com.shine.framework.biz.BaseService;
import com.shine.framework.entity.BaseEntity;
import com.shine.framework.web.BaseAction;

public class SysUserAction extends BaseAction<BaseService>{

	private static final long serialVersionUID = -230230441917393096L;

	private SysUser e = new SysUser();
	
	@Override
	public SysUser getE() {
		return e;
	}

	@Override
	protected void setE(BaseEntity e) {
		this.e = (SysUser)e;
	}

}
