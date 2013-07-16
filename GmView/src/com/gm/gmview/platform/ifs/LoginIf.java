package com.gm.gmview.platform.ifs;

/**
 * 登入登出接口
 * 
 * @author viruscodecn@gmail.com
 * 
 */
public interface LoginIf {
	public boolean login(String userName, String password);

	public boolean logout(String userName);
}
