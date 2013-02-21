package com.shine.common.sysmgr.web;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import net.sf.json.JsonConfig;

import com.shine.common.sysmgr.entity.SysFunction;
import com.shine.common.sysmgr.entity.SysMenu;
import com.shine.common.sysmgr.entity.SysRole;
import com.shine.framework.biz.BaseService;
import com.shine.framework.dao.util.QueryAnalyzer;
import com.shine.framework.dao.util.QueryItem;
import com.shine.framework.entity.BaseEntity;
import com.shine.framework.entity.PersistResult;
import com.shine.framework.web.AjaxAction;

public class SysRoleAction extends AjaxAction<BaseService> {

	private static final long serialVersionUID = 8144723623173944937L;

	private SysRole e = new SysRole();
	
	@Override
	protected JsonConfig getJsonConfig() {
		JsonConfig jc = new JsonConfig();
		jc.setExcludes(new String[]{"delflag","deltime","existSQL","virtualDelete","menus","funs"});
		return jc;
	}
	
	/**
	 * 进入授权页面
	 * @return
	 */
	public String toGrant(){
		view();
		QueryAnalyzer analyzer = new QueryAnalyzer();
		analyzer.setEntity(new SysMenu());
		analyzer.addItem("pid", "0", QueryItem.EQ, QueryItem.INTEGER);
		analyzer.addSortField("orderId").addSortField("menuId");
		extor.buildQueryItem(analyzer);
		List allMenus = service.list(analyzer);
		List<SysMenu> dstList = new ArrayList<SysMenu>();
		cascadeDatas(dstList,allMenus, 0);
		request.setAttribute("menuList", dstList);
		allMenus = null;
		return "toGrant";
	}
	
	/**
	 * 将子菜单和功能等都封装好并放入dstList中,包括：<br/>
	 * 菜单的多层次显示，在菜单名前加 |- <br/>
	 * 将当前角色拥有的菜单和功能的checked设置成true
	 * @param dstList
	 * @param list
	 * @param level
	 */
	private void cascadeDatas(List<SysMenu> dstList,Collection list,int level){
		Iterator<SysMenu> it = list.iterator();
		while(it.hasNext()){
			String space = "";
			for(int j=0;j<level;j++)
				space += "&nbsp;&nbsp;&nbsp;&nbsp;";
			if(level>0)
				space += "|-";
			SysMenu menu = it.next();
			
			menu.setMenuName(space+menu.getMenuName());
			menu.setChecked(menuChecked(menu));
			
			for(SysFunction fun : menu.getFuns()){
				fun.setChecked(funChecked(fun));
			}
			
			dstList.add(menu);
			
			space = null;
			
			//如果当前菜单有子菜单，则对子菜单进行同样处理
			Set<SysMenu> c = menu.getChildren();
			if(c!=null&&c.size()>0)
				cascadeDatas(dstList, c, level+1);
		}
	}
	
	/**
	 * 检测所传菜单是否为当前角色所拥有
	 * @param menu
	 * @return
	 */
	private boolean menuChecked(SysMenu menu){
		for(SysMenu rmenu : e.getMenus()){
			if(rmenu.getMenuId().equals(menu.getMenuId()))
				return true;
		}
		return false;
	}
	
	/**
	 * 检测所传功能是否为当前角色所拥有
	 * @param fun
	 * @return
	 */
	private boolean funChecked(SysFunction fun){
		for(SysFunction rfun : e.getFuns()){
			if(rfun.getFunId().equals(fun.getFunId()))
				return true;
		}
		return false;
	}
	
	/**
	 * 保存授权
	 */
	public void saveGrant() {
		try{
			SysRole role = (SysRole)service.get(e);
			role.getMenus().clear();
			role.getFuns().clear();
			String[] menus = extor.getArrayValue("menus");
			String[] funs = extor.getArrayValue("funs");
			if(menus!=null){
				for(String mid : menus){
					SysMenu menu = new SysMenu();
					menu.setMenuId(Integer.parseInt(mid));
					role.getMenus().add(menu);
				}
			}
			if(funs!=null){
				for(String fid : funs){
					SysFunction fun = new SysFunction();
					fun.setFunId(Integer.parseInt(fid));
					role.getFuns().add(fun);
				}
			}
			//这里用merge而不是update，避免异常：Illegal attempt to associate a collection with two open sessions
			printOutText(service.merge(role).toJson());
		}catch(Exception e){
			e.printStackTrace();
			printOutText(new PersistResult(PersistResult.ERROR, PersistResult.MSG_ERROR).toJson());
		}
	}

	@Override
	public void update() {
		try{
			SysRole role = (SysRole)service.get(e);
			e.setMenus(role.getMenus());
			e.setFuns(role.getFuns());
			printOutText(service.merge(getE()).toJson());
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
		this.e = (SysRole)e;
	}

}
