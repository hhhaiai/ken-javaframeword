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
import com.shine.platform.security.UrlSecurityContext;

public class SysFunctionAction extends AjaxAction<BaseService> {

	private static final long serialVersionUID = -7150171628156628085L;
	private SysFunction e = new SysFunction();
	private Integer menuId;	//菜单ID
	
	private UrlSecurityContext urlSecurityContext;
	
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
			//过滤掉这些，否则json会报错，同时避免Hibernate延时加载加载不必要的资源
			jc.setExcludes(new String[]{"urls","existSQL","virtualDelete","funUrls","menu","sysMenu"});
			printOutJsonList(list, page, jc);
		}catch(Exception e){
			e.printStackTrace();
		}
	}
	
	/**
	 * 获取并设置子URL
	 */
	private void extorChildren(){
		int urlCount = extor.getIntValue("urlCount");
		if(urlCount>0){
			for(int i=0;i<urlCount;i++){
				String uurl = extor.getValue("uurl_"+i);
				if(uurl==null||uurl.length()<1)
					continue;
				SysFunctionUrl url = new SysFunctionUrl();
				url.setUurl(uurl);
				url.setIsLog(extor.getIntValue("log_"+i));
				String id = extor.getValue("urlId_"+i);
				if(id!=null&&id.length()>0)
					url.setUrlId(Integer.parseInt(id));
				url.setFunc(e);
				e.getUrls().add(url);
			}
		}
	}

	@Override
	public void save() {
		try{
			extorChildren();
			PersistResult pr = service.save(getE());
			if(urlSecurityContext!=null)
				urlSecurityContext.reload(2);	//更新URL权限管理上下文相关数据
			printOutText(pr.toJson());
		}catch(Exception e){
			e.printStackTrace();
			printOutText(new PersistResult(PersistResult.ERROR, PersistResult.MSG_ERROR).toJson());
		}
	}

	@Override
	public void update() {
		extorChildren();
		PersistResult pr = service.update(getE());
		if(urlSecurityContext!=null)
			urlSecurityContext.reload(2);	//更新URL权限管理上下文相关数据
		printOutText(pr.toJson());
	}
	
	@Override
	public void delete() {
		PersistResult pr = null;
		try{
			pr = doDelete();
			if(urlSecurityContext!=null)
				urlSecurityContext.reload(2);	//更新URL权限管理上下文相关数据
			printOutText(pr.toJson());
		}catch(Exception e){
			e.printStackTrace();
			printOutText(new PersistResult(PersistResult.ERROR, PersistResult.MSG_ERROR).toJson());
		}
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

	public void setUrlSecurityContext(UrlSecurityContext urlSecurityContext) {
		this.urlSecurityContext = urlSecurityContext;
	}

}
