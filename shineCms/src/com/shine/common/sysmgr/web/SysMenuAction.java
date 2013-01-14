package com.shine.common.sysmgr.web;

import java.util.List;

import com.shine.common.sysmgr.entity.SysMenu;
import com.shine.framework.biz.BaseService;
import com.shine.framework.dao.util.QueryAnalyzer;
import com.shine.framework.entity.BaseEntity;
import com.shine.framework.entity.PersistResult;
import com.shine.framework.web.AjaxAction;

public class SysMenuAction extends AjaxAction<BaseService>{

	private static final long serialVersionUID = -8274394737739352L;
	
	private SysMenu e = new SysMenu(); 

	@SuppressWarnings("unchecked")
	@Override
	public String enter() {
		QueryAnalyzer analyzer = new QueryAnalyzer();
		analyzer.setEntity(getE());
		extor.buildQueryItem(analyzer);
		List list = service.list(analyzer);
		request.setAttribute(LIST, list);
		return ENTER;
	}

	@Override
	public String toAdd() {
		return TOADD;
	}

	@Override
	public String toEdit() {
		return super.toEdit();
	}

	@Override
	public void save() {
//		super.save();
		printOutText(new PersistResult(PersistResult.SUCCESS, PersistResult.MSG_SUCCESS).toJson());
	}

	@Override
	public void update() {
		// TODO Auto-generated method stub
		super.update();
	}

	@Override
	public BaseEntity getE() {
		return e;
	}

	@Override
	protected void setE(BaseEntity e) {
		this.e = (SysMenu)e;
	}

}
