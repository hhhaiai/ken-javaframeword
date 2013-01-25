package com.shine.platform.security.auth;

import java.io.Serializable;

/**
 * 用户接口,用于权限控制及密码加密等
 * @author JiangKunpeng 2013.01.25
 * @version 2013.01.25
 *
 */
public interface User extends Serializable {
	
	/**
	 * 获取用户名
	 * @return
	 */
	public abstract String getUsername();
	
	/**
	 * 获取密码
	 * @return
	 */
	public abstract String getPassword();
	
}
