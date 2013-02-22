package com.shine.platform.security.auth;

import com.shine.framework.entity.BaseEntity;

/**
 * 用户接口,用于权限控制及密码加密等
 * @author JiangKunpeng 2013.01.25
 * @version 2013.02.21
 *
 */
public interface User extends BaseEntity {
	
	/**
	 * 获取用户ID
	 * @return
	 */
	public abstract Integer getUserId();
	
	/**
	 * 获取用户名
	 * @return
	 */
	public abstract String getUsername();
	
	/**
	 * 设置用户名
	 * @param username
	 */
	public abstract void setUsername(String username);
	
	/**
	 * 获取密码
	 * @return
	 */
	public abstract String getPassword();
	
	/**
	 * 设置密码
	 * @param password
	 */
	public abstract void setPassword(String password);
	
	/**
	 * 获取姓名
	 * @return
	 */
	public abstract String getName();
	
}
