package com.shine.common.sysmgr.entity;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import com.shine.framework.dao.util.QuerySQL;
import com.shine.framework.entity.BaseEntity;

public class SysRole implements BaseEntity {

	private static final long serialVersionUID = 4951123418205561865L;
	
	private Integer roleId;
	private String name;
	private String remark;
	
	private Integer delflag;
	private Date deltime;
	
	private Set<SysMenu> menus = new HashSet<SysMenu>();
	private Set<SysFunction> funs = new HashSet<SysFunction>();
	
	public SysRole(){
	}
	
	public SysRole(Integer roleId){
		this.roleId = roleId;
	}

	@Override
	public QuerySQL getExistSQL() {
		QuerySQL sql = null;
		if(roleId==null)
			sql = new QuerySQL("from SysRole r where r.name=?").setValues(new Object[]{name});
		else
			sql = new QuerySQL("from SysRole r where r.name=? and r.roleId<>?").setValues(new Object[]{name,roleId});
		return sql;
	}

	@Override
	public boolean isVirtualDelete() {
		return true;
	}

	public Integer getRoleId() {
		return roleId;
	}
	public void setRoleId(Integer roleId) {
		this.roleId = roleId;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getRemark() {
		return remark;
	}
	public void setRemark(String remark) {
		this.remark = remark;
	}
	public Integer getDelflag() {
		return delflag;
	}
	public void setDelflag(Integer delflag) {
		this.delflag = delflag;
	}
	public Date getDeltime() {
		return deltime;
	}
	public void setDeltime(Date deltime) {
		this.deltime = deltime;
	}
	public Set<SysMenu> getMenus() {
		return menus;
	}
	public void setMenus(Set<SysMenu> menus) {
		this.menus = menus;
	}
	public Set<SysFunction> getFuns() {
		return funs;
	}
	public void setFuns(Set<SysFunction> funs) {
		this.funs = funs;
	}
}
