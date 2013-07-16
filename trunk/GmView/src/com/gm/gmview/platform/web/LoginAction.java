package com.gm.gmview.platform.web;

import javax.servlet.http.HttpServletRequest;

import com.gm.gmview.framework.util.ApplicationContextUtil;
import com.gm.gmview.framework.web.BaseAction;
import com.gm.gmview.test.dao.UserDao;

public class LoginAction extends BaseAction {

	private String userName;
	private String password;

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String execute() throws Exception {
		UserDao dao = (UserDao) ApplicationContextUtil.getContext().getBean(
				"userDao");
		return SUCCESS;
	}

	public String logout() throws Exception {
		return SUCCESS;
	}

}
