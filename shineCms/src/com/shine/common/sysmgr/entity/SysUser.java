package com.shine.common.sysmgr.entity;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import com.shine.framework.dao.util.QuerySQL;

public class SysUser implements com.shine.platform.security.auth.User{

	private static final long serialVersionUID = -647542899691049799L;

	private Integer userId;
	private String username;
	private String password;
	private String name;
	
	private Integer delflag;
	private Date deltime;
	
	private Set<SysRole> roles = new HashSet<SysRole>();	//角色
	
	public static final String RoleSeparator = ",";		//角色ID的分隔符
	
	public SysUser(){
	}
	
	public SysUser(int userId){
		this.userId = userId;
	}
	
	/**
	 * 通过逗号隔开的角色ID设置用户角色（主要用于自动获取编辑页面选择的角色）
	 * @param roleIds	如：1,2,4
	 */
	public void setRoleIds(String roleIds){
		roles.clear();
		if(roleIds!=null){
			String[] idArray = roleIds.split(RoleSeparator);
			for(String id : idArray){
				if(id.length()<1)
					continue;
				int intId = Integer.parseInt(id);
				roles.add(new SysRole(intId));
			}
		}
	}
	
	/**
	 * 获取以逗号隔开的角色ID
	 * @return
	 */
	public String getRoleIds(){
		StringBuffer rstr = new StringBuffer(20);
		if(roles != null && roles.size() > 0){
			for(SysRole role : roles){
				rstr.append(role.getRoleId()).append(RoleSeparator);
			}
			int len = rstr.length();
			rstr.delete(len-1, len);
		}
		return rstr.toString();
	}
	
	@Override
	public QuerySQL getExistSQL() {
		QuerySQL sql = null;
		if(userId==null)
			sql = new QuerySQL("from SysUser u where (u.delflag is null or u.delflag=0) and u.username=?").setValues(new Object[]{username});
		else
			sql = new QuerySQL("from SysUser u where (u.delflag is null or u.delflag=0) and u.username=? and u.userId<>?").setValues(new Object[]{username,userId});
		return sql;
	}

	@Override
	public boolean isVirtualDelete() {
		return true;
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
