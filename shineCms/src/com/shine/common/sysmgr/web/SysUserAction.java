package com.shine.common.sysmgr.web;

import java.util.List;

import net.sf.json.JsonConfig;

import com.shine.common.sysmgr.entity.SysRole;
import com.shine.framework.biz.BaseService;
import com.shine.framework.dao.util.QueryAnalyzer;
import com.shine.framework.entity.BaseEntity;
import com.shine.framework.entity.PersistResult;
import com.shine.framework.web.AjaxAction;
import com.shine.platform.security.encrypt.UserPassGenerator;

public class SysUserAction extends AjaxAction<BaseService>{

	private static final long serialVersionUID = -230230441917393096L;

	private com.shine.platform.security.auth.User e;
	
	//密码加密接口
	private UserPassGenerator userPassGenerator;
	
	@Override
	protected JsonConfig getJsonConfig() {
		JsonConfig jc = new JsonConfig();
		jc.setExcludes(new String[]{"delflag","deltime","existSQL","virtualDelete","roles","roleIds"});
		return jc;
	}

	/**
	 * 进入增加、编辑时加载数据
	 */
	private void initData(){
		QueryAnalyzer analyzer = new QueryAnalyzer();
		analyzer.setEntity(new SysRole()).addSortField("roleId");
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
	public void save() {
		try{
			//密码加密
			e.setPassword(userPassGenerator.generatePassword(e));
			printOutText(service.save(getE()).toJson());
		}catch(Exception e){
			e.printStackTrace();
			printOutText(new PersistResult(PersistResult.ERROR, PersistResult.MSG_ERROR).toJson());
		}
	}

	@Override
	public void update() {
		try{
			String pass = e.getPassword();
			if(pass==null||pass.length()<1){
				com.shine.platform.security.auth.User user = (com.shine.platform.security.auth.User)service.get(e);
				e.setPassword(user.getPassword());
			}else{
				//密码加密
				e.setPassword(userPassGenerator.generatePassword(e));
			}
			printOutText(service.update(e).toJson());
		}catch(Exception e){
			e.printStackTrace();
			printOutText(new PersistResult(PersistResult.ERROR, PersistResult.MSG_ERROR).toJson());
		}
	}

	public com.shine.platform.security.auth.User getE() {
		return e;
	}

	public void setE(BaseEntity e) {
		this.e = (com.shine.platform.security.auth.User)e;
	}

	public UserPassGenerator getUserPassGenerator() {
		return userPassGenerator;
	}

	public void setUserPassGenerator(UserPassGenerator userPassGenerator) {
		this.userPassGenerator = userPassGenerator;
	}

}
