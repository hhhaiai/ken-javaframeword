package com.shine.common.sysmgr.web;

import com.shine.common.sysmgr.entity.SysUser;
import com.shine.framework.biz.BaseService;
import com.shine.framework.entity.BaseEntity;
import com.shine.framework.web.AjaxAction;

public class SysUserAction extends AjaxAction<BaseService>{

	private static final long serialVersionUID = -230230441917393096L;

	private SysUser e = new SysUser();
	
	@Override
	public String toAdd() {
		// TODO Auto-generated method stub
		return super.toAdd();
	}

	@Override
	public String toEdit() {
		// TODO Auto-generated method stub
		return super.toEdit();
	}

	@Override
	public void save() {
		// TODO Auto-generated method stub
		super.save();
	}

	@Override
	public void update() {
		// TODO Auto-generated method stub
		super.update();
	}

	@Override
	public SysUser getE() {
		return e;
	}

	@Override
	protected void setE(BaseEntity e) {
		this.e = (SysUser)e;
	}

}
