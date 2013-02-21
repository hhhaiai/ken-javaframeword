package com.shine.common.sysmgr.web;

import java.util.List;

import net.sf.json.JsonConfig;

import com.shine.common.sysmgr.entity.SysRole;
import com.shine.common.sysmgr.entity.SysUser;
import com.shine.framework.biz.BaseService;
import com.shine.framework.dao.util.DefaultPagination;
import com.shine.framework.dao.util.Pagination;
import com.shine.framework.dao.util.QueryAnalyzer;
import com.shine.framework.dao.util.QueryItem;
import com.shine.framework.entity.BaseEntity;
import com.shine.framework.entity.PersistResult;
import com.shine.framework.web.AjaxAction;
import com.shine.platform.security.encrypt.UserPassGenerator;

public class SysUserAction extends AjaxAction<BaseService>{

	private static final long serialVersionUID = -230230441917393096L;

	private SysUser e = new SysUser();
	
	//密码加密接口
	private UserPassGenerator userPassGenerator;
	
	@Override
	protected JsonConfig getJsonConfig() {
		JsonConfig jc = new JsonConfig();
		jc.setExcludes(new String[]{"delflag","deltime","existSQL","virtualDelete","roles","roleIds"});
		return jc;
	}
	
	@Override
	public void list() {
		try{
			QueryAnalyzer analyzer = new QueryAnalyzer();
			analyzer.setEntity(getE());
//			analyzer.setBaseSQL("from SysUser _E inner join fetch _E.roles r inner join fetch r.menus m where 1=1 AND(_E.delflag is null or _E.delflag=0) and m.menuId=22","_E");
			Pagination page = new DefaultPagination();
			page.init(extor.getIntValue("start"), extor.getIntValue("limit"));
			analyzer.setPage(page);
//			analyzer.addItem("roles.menus.funs.funId", "9", QueryItem.EQ, QueryItem.INTEGER);
//			analyzer.addSorter("roles.roleId", true);
			extor.buildQueryItem(analyzer);
			List list = service.list(analyzer);
			printOutJsonList(list, page, getJsonConfig());
		}catch(Exception e){
			e.printStackTrace();
		}
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
				SysUser user = (SysUser)service.get(e);
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

	@Override
	public SysUser getE() {
		return e;
	}

	@Override
	protected void setE(BaseEntity e) {
		this.e = (SysUser)e;
	}

	public UserPassGenerator getUserPassGenerator() {
		return userPassGenerator;
	}

	public void setUserPassGenerator(UserPassGenerator userPassGenerator) {
		this.userPassGenerator = userPassGenerator;
	}

}
