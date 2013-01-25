package com.shine.common.sysmgr.web;

import java.util.List;

import net.sf.json.JsonConfig;

import com.shine.common.sysmgr.entity.SysRole;
import com.shine.common.sysmgr.entity.SysUser;
import com.shine.framework.biz.BaseService;
import com.shine.framework.dao.util.QueryAnalyzer;
import com.shine.framework.entity.BaseEntity;
import com.shine.framework.entity.PersistResult;
import com.shine.framework.web.AjaxAction;

public class SysUserAction extends AjaxAction<BaseService>{

	private static final long serialVersionUID = -230230441917393096L;

	private SysUser e = new SysUser();
	
	@Override
	protected JsonConfig getJsonConfig() {
		if(JsonConfig==null){
			JsonConfig = new JsonConfig();
			JsonConfig.setExcludes(new String[]{"delflag","deltime","existSQL","virtualDelete","roles","roleIds"});
		}
		return JsonConfig;
	}
	
	/**
	 * 进入增加、编辑时加载数据
	 */
	private void initData(){
		QueryAnalyzer analyzer = new QueryAnalyzer();
		analyzer.setEntity(new SysRole());
		analyzer.setSortField("roleId");
		extor.buildQueryItem(analyzer);
		List roles = service.list(analyzer);
		request.setAttribute("roleList", roles);
	}
	
	@Override
	public String toAdd() {
		initData();
		return super.toAdd();
	}

	@Override
	public String toEdit() {
		initData();
		return super.toEdit();
	}

	@Override
	public void update() {
		try{
			String pass = e.getPassword();
			if(pass!=null&&pass.length()<1){
				SysUser user = (SysUser)service.get(e);
				e.setPassword(user.getPassword());
			}
			printOutText(service.update(e).toJson());
		}catch(Exception e){
			e.printStackTrace();
			printOutText(new PersistResult(PersistResult.ERROR, PersistResult.MSG_ERROR).toJson());
		}
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
