package com.shine.common.sysmgr.web;

import java.util.List;

import net.sf.json.JsonConfig;

import com.shine.common.sysmgr.entity.SysFunction;
import com.shine.common.sysmgr.entity.SysFunctionUrl;
import com.shine.common.sysmgr.entity.SysMenu;
import com.shine.framework.biz.BaseService;
import com.shine.framework.dao.util.DefaultPagination;
import com.shine.framework.dao.util.Pagination;
import com.shine.framework.dao.util.QueryAnalyzer;
import com.shine.framework.dao.util.QueryItem;
import com.shine.framework.entity.BaseEntity;
import com.shine.framework.entity.PersistResult;
import com.shine.framework.web.AjaxAction;

public class SysFunctionAction extends AjaxAction<BaseService> {

	private static final long serialVersionUID = -7150171628156628085L;
	private SysFunction e = new SysFunction();
	private Integer menuId;	//菜单ID
	
	@Override
	public String enter() {
		if(menuId!=null){
			SysMenu parent = new SysMenu();
			parent.setMenuId(menuId);
			parent = (SysMenu)service.get(parent);
			if(parent!=null)
				request.setAttribute("parent", parent);
		}
		return ENTER;
	}

	@Override
	public void list() {
		try{
			QueryAnalyzer analyzer = new QueryAnalyzer();
			analyzer.setEntity(getE());
			analyzer.addItem("menuId", menuId+"", QueryItem.EQ, QueryItem.INTEGER);
			Pagination page = new DefaultPagination();
			page.init(extor.getIntValue("start"), extor.getIntValue("limit"));
			analyzer.setPage(page);
			extor.buildQueryItem(analyzer);
			List list = service.list(analyzer);
			JsonConfig jc = new JsonConfig();
			jc.setExcludes(new String[]{"urls"});
			printOutJsonList(list, page, jc);
		}catch(Exception e){
			e.printStackTrace();
		}
	}

	@Override
	public void save() {
		try{
			for(int i=0;i<2;i++){
				SysFunctionUrl url1 = new SysFunctionUrl();
				url1.setUurl("url-"+i);
				url1.setIsLog(0);
				url1.setFunc(e);
				e.getUrls().add(url1);
			}
			printOutText(service.save(getE()).toJson());
		}catch(Exception e){
			e.printStackTrace();
			printOutText(new PersistResult(PersistResult.ERROR, PersistResult.MSG_ERROR).toJson());
		}
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
		this.e = (SysFunction)e;
	}

	public Integer getMenuId() {
		return menuId;
	}

	public void setMenuId(Integer menuId) {
		this.menuId = menuId;
	}

}
