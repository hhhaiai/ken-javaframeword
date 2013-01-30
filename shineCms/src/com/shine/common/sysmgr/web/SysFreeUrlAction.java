package com.shine.common.sysmgr.web;

import com.shine.common.sysmgr.entity.SysFreeUrl;
import com.shine.framework.biz.BaseService;
import com.shine.framework.entity.BaseEntity;
import com.shine.framework.entity.PersistResult;
import com.shine.framework.web.AjaxAction;
import com.shine.platform.security.UrlSecurityContext;

public class SysFreeUrlAction extends AjaxAction<BaseService> {

	private static final long serialVersionUID = -7933616614493551967L;
	
	private SysFreeUrl e = new SysFreeUrl();

	private UrlSecurityContext urlSecurityContext;
	
	@Override
	public void save() {
		try{
			PersistResult pr = service.save(getE());
			if(urlSecurityContext!=null)
				urlSecurityContext.reload(1);	//更新URL权限管理上下文相关数据
			printOutText(pr.toJson());
		}catch(Exception e){
			e.printStackTrace();
			printOutText(new PersistResult(PersistResult.ERROR, PersistResult.MSG_ERROR).toJson());
		}
	}

	@Override
	public void update() {
		try{
			PersistResult pr = service.update(getE());
			if(urlSecurityContext!=null)
				urlSecurityContext.reload(1);	//更新URL权限管理上下文相关数据
			printOutText(pr.toJson());
		}catch(Exception e){
			e.printStackTrace();
			printOutText(new PersistResult(PersistResult.ERROR, PersistResult.MSG_ERROR).toJson());
		}
	}
	
	@Override
	public void delete() {
		PersistResult pr = null;
		try{
			pr = doDelete();
			if(urlSecurityContext!=null)
				urlSecurityContext.reload(1);	//更新URL权限管理上下文相关数据
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
		this.e = (SysFreeUrl)e;
	}

	public void setUrlSecurityContext(UrlSecurityContext urlSecurityContext) {
		this.urlSecurityContext = urlSecurityContext;
	}

}
