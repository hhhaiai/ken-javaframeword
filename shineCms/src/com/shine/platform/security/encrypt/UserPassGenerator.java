package com.shine.platform.security.encrypt;


/**
 * 用户密码生成器
 * @author JiangKunpeng 2013.01.28
 * @version 2013.01.28
 *
 */
public interface UserPassGenerator {
	
	/**
	 * 生成密码
	 * @param user
	 * @return
	 */
	public abstract String generatePassword(com.shine.platform.security.auth.User user) throws Exception;
	
}
