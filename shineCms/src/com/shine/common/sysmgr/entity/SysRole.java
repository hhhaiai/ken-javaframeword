package com.shine.common.sysmgr.entity;

import java.util.Date;

import com.shine.framework.dao.util.QuerySQL;
import com.shine.framework.entity.BaseEntity;

public class SysRole implements BaseEntity {

	private static final long serialVersionUID = 4951123418205561865L;
	
	private String roleId;
	private String name;
	private String remark;
	
	private Integer delflag;
	private Date deltime;

	@Override
	public QuerySQL getExistSQL() {
		QuerySQL sql = null;
		if(roleId==null||roleId.length()==-1)
			sql = new QuerySQL("from SysRole r where r.name=?").setValues(new Object[]{name});
		else
			sql = new QuerySQL("from SysRole r where r.name=? and r.roleId<>?").setValues(new Object[]{name,roleId});
		return sql;
	}

	@Override
	public boolean isVirtualDelete() {
		return true;
	}

	public String getRoleId() {
		return roleId;
	}
	public void setRoleId(String roleId) {
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
}
