package com.gm.gmPlatform.web;

import com.gm.framework.web.BaseAction;
import com.gm.gmPlatform.GmPlatformManager;
import com.gm.gmPlatform.model.ResultModel;
import com.gm.gmPlatform.service.LoginService;
import com.shine.DBUtil.DBUtil;
import com.shine.DBUtil.model.DBModel;

/**
 * 登陆登出action
 * 
 * @author viruscodecn@gmail.com
 * 
 */
public class LoginAction extends BaseAction<LoginService> {

	public LoginAction() {
		super();
		this.setService(new LoginService());
	}

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

	public String login() throws Exception {
		// 项目名称
		this.putRequest("name", GmPlatformManager.getManager().getPluginMap()
				.getPlugin().getProjectName());

		ResultModel rm = this.service.loginIn(userName, password);
		if (rm.isResult()) {
			return SUCCESS;
		}
		return ERROR;
	}

	public String logout() throws Exception {
		return SUCCESS;
	}

}
