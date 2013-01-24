package com.shine.common.sysmgr.entity;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import com.shine.framework.dao.util.QuerySQL;
import com.shine.framework.entity.BaseEntity;

public class SysUser implements BaseEntity{

	private static final long serialVersionUID = -647542899691049799L;

	private Integer userId;
	private String username;
	private String password;
	private String name;
	
	private Integer delflag;
	private Date deltime;
	
	private Set<SysRole> roles = new HashSet<SysRole>();	//角色
	
	@Override
	public QuerySQL getExistSQL() {
		QuerySQL sql = null;
		if(userId==null)
			sql = new QuerySQL("from SysUser u where u.username=?").setValues(new Object[]{username});
		else
			sql = new QuerySQL("from SysUser u where u.username=? and u.userId<>?").setValues(new Object[]{username,userId});
		return sql;
	}

	@Override
	public boolean isVirtualDelete() {
		return false;
	}

	public Integer getUserId() {
		return userId;
	}
	public void setUserId(Integer userId) {
		this.userId = userId;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
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

	public Set<SysRole> getRoles() {
		return roles;
	}

	public void setRoles(Set<SysRole> roles) {
		this.roles = roles;
	}
}
