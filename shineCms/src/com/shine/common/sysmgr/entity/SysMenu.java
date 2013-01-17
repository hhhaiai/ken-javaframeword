package com.shine.common.sysmgr.entity;

import com.shine.framework.dao.util.QuerySQL;
import com.shine.framework.entity.BaseEntity;

public class SysMenu implements BaseEntity {

	private static final long serialVersionUID = 7873258527829373370L;
	
	private Integer menuId;
	private Integer pid;
	private Integer orderId;
	private String menuName;
	private String murl;
	private String icon;
	private String remark;
	private String treeCode;
	private Integer ismenu;
	private Integer enable;

	@Override
	public QuerySQL getExistSQL() {
		return null;
	}

	@Override
	public boolean isVirtualDelete() {
		return false;
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

	public String getTreeCode() {
		return treeCode;
	}

	public void setTreeCode(String treeCode) {
		this.treeCode = treeCode;
	}

	public Integer getIsmenu() {
		return ismenu;
	}

	public void setIsmenu(Integer ismenu) {
		this.ismenu = ismenu;
	}

}
