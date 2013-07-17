package com.gm.gmview.platform.web;

import com.gm.gmview.framework.web.BaseAction;
import com.gm.gmview.platform.PlatformManager;
import com.gm.gmview.test.dao.UserDao;

public class LoginAction extends BaseAction {

	private UserDao dao;
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
		System.out.println(dao.login(null, null));
		this.request.put("name", PlatformManager.getManager().getProjectName());
		return SUCCESS;
	}

	public String logout() throws Exception {
		return SUCCESS;
	}

	public UserDao getDao() {
		return dao;
	}

	public void setDao(UserDao dao) {
		this.dao = dao;
	}

}
