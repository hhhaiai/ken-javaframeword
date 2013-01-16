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
		analyzer.setSortField("orderId");
		extor.buildQueryItem(analyzer);
		List list = service.list(analyzer);
		request.setAttribute(LIST, list);
		return ENTER;
	}

	@Override
	public String toAdd() {
		String pname = null;
		if(e.getPid()!=0){
			SysMenu pmenu = new SysMenu();
			pmenu.setMenuId(e.getPid());
			pmenu = (SysMenu)service.get(pmenu);
			if(pmenu!=null)
				pname = pmenu.getMenuName();
		}else{
			pname = "菜单导航";
		}
		request.setAttribute("pname", pname);
		return TOADD;
	}

	@Override
	public String toEdit() {
		view();
		
		String pname = null;
		if(e!=null&&e.getPid()!=0){
			SysMenu pmenu = new SysMenu();
			pmenu.setMenuId(e.getPid());
			pmenu = (SysMenu)service.get(pmenu);
			if(pmenu!=null)
				pname = pmenu.getMenuName();
		}else{
			pname = "菜单导航";
		}
		request.setAttribute("pname", pname);
		return TOEDIT;
	}

	@Override
	public void save() {
		try{
			PersistResult pr = service.save(getE());
			pr.putData("menuid", e.getMenuId());
			
			printOutText(pr.toJson());
		}catch(Exception e){
			printOutText(new PersistResult(PersistResult.ERROR, PersistResult.MSG_ERROR).toJson());
			e.printStackTrace();
		}
	}

	@Override
	public void update() {
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
