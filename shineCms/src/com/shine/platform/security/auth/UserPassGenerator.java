package com.shine.platform.security.auth;

/**
 * 用户密码生成器
 * @author JiangKunpeng 2013.01.25
 * @version 2013.01.25
 *
 */
public interface UserPassGenerator {
	
	/**
	 * 生成密码
	 * @param user
	 * @return
	 */
	public abstract String Generate(com.shine.platform.security.auth.User user);
	
}
