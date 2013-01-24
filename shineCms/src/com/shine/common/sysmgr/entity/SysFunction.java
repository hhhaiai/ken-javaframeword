package com.shine.common.sysmgr.entity;

import java.util.HashSet;
import java.util.Set;

import com.shine.framework.dao.util.QuerySQL;
import com.shine.framework.entity.BaseEntity;

public class SysFunction implements BaseEntity {
	
	private static final long serialVersionUID = -3833729998299710235L;
	
	private Integer funId;
	private Integer menuId;
	private Integer orderId;
	private String funKey;
	private String funName;
	private Set<SysFunctionUrl> urls = new HashSet<SysFunctionUrl>();
	
	private Boolean checked;	//是否勾选（用于分配权限时，不在数据库中存储）

	@Override
	public QuerySQL getExistSQL() {
		return null;
	}

	@Override
	public boolean isVirtualDelete() {
		return false;
	}

	public Integer getFunId() {
		return funId;
	}

	public void setFunId(Integer funId) {
		this.funId = funId;
	}

	public Integer getMenuId() {
		return menuId;
	}

	public void setMenuId(Integer menuId) {
		this.menuId = menuId;
	}

	public Integer getOrderId() {
		return orderId;
	}

	public void setOrderId(Integer orderId) {
		this.orderId = orderId;
	}

	public String getFunKey() {
		return funKey;
	}

	public void setFunKey(String funKey) {
		this.funKey = funKey;
	}

	public String getFunName() {
		return funName;
	}

	public void setFunName(String funName) {
		this.funName = funName;
	}

	public Set<SysFunctionUrl> getUrls() {
		return urls;
	}

	public void setUrls(Set<SysFunctionUrl> urls) {
		this.urls = urls;
	}

	public Boolean getChecked() {
		return checked;
	}

	public void setChecked(Boolean checked) {
		this.checked = checked;
	}

}
