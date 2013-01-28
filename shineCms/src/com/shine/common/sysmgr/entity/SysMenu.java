package com.shine.common.sysmgr.entity;

import java.util.HashSet;
import java.util.Set;

import com.shine.framework.dao.util.QuerySQL;
import com.shine.framework.entity.BaseEntity;

public class SysMenu implements BaseEntity , com.shine.platform.security.auth.Menu{

	private static final long serialVersionUID = 7873258527829373370L;
	
	private Integer menuId;
	private Integer pid;
	private Integer orderId;
	private String menuName;
	private String murl;
	private String icon;
	private String remark;
	private Integer ismenu;
	private Integer enable;
	
	private Set<SysMenu> children = new HashSet<SysMenu>();			//子菜单
	private Set<SysFunction> funs = new HashSet<SysFunction>();		//功能
	
	private Boolean checked;	//是否勾选（用于分配权限时，不在数据库中存储）

	@Override
	public QuerySQL getExistSQL() {
		return null;
	}

	@Override
	public boolean isVirtualDelete() {
		return false;
	}
	
	@Override
	public Set<com.shine.platform.security.auth.Menu> getMenuChildren() {
		if(children==null)
			return null;
		Set<com.shine.platform.security.auth.Menu> menus = new HashSet<com.shine.platform.security.auth.Menu>();
		menus.addAll(children);
		return menus;
	}
	
	@Override
	public boolean isMenu() {
		return "1".equals(ismenu);
	}

	public Integer getMenuId() {
		return menuId;
	}

	public void setMenuId(Integer menuId) {
		this.menuId = menuId;
	}

	public Integer getPid() {
		return pid;
	}

	public void setPid(Integer pid) {
		this.pid = pid;
	}

	public Integer getOrderId() {
		return orderId;
	}

	public void setOrderId(Integer orderId) {
		this.orderId = orderId;
	}

	public String getMenuName() {
		return menuName;
	}

	public void setMenuName(String menuName) {
		this.menuName = menuName;
	}

	public String getMurl() {
		return murl;
	}

	public void setMurl(String murl) {
		this.murl = murl;
	}

	public String getIcon() {
		return icon;
	}

	public void setIcon(String icon) {
		this.icon = icon;
	}

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public Integer getEnable() {
		return enable;
	}

	public void setEnable(Integer enable) {
		this.enable = enable;
	}

	public Integer getIsmenu() {
		return ismenu;
	}

	public void setIsmenu(Integer ismenu) {
		this.ismenu = ismenu;
	}

	public Set<SysMenu> getChildren() {
		return children;
	}

	public void setChildren(Set<SysMenu> children) {
		this.children = children;
	}

	public Boolean getChecked() {
		return checked;
	}

	public void setChecked(Boolean checked) {
		this.checked = checked;
	}

	public Set<SysFunction> getFuns() {
		return funs;
	}

	public void setFuns(Set<SysFunction> funs) {
		this.funs = funs;
	}

}
