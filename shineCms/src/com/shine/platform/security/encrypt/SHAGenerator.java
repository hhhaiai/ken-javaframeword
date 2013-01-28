package com.shine.platform.security.encrypt;

import com.shine.platform.security.auth.User;
import com.shine.util.EncryptUtil;

/**
 * 使用SHA加密算法进行加密计算
 * @author JiangKunpeng 2013.01.28
 * @version 2013.01.28
 *
 */
public class SHAGenerator implements UserPassGenerator{
	private static final String ALGORITHM = "SHA";

	@Override
	public String generatePassword(User user) throws Exception {
		return EncryptUtil.encryptSimple(user.getUsername()+user.getPassword(), ALGORITHM);
	}
	
}
