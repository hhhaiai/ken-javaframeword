package com.gm.gmPlatform.web;

import com.gm.framework.web.BaseAction;
import com.gm.gmPlatform.GmPlatformManager;
import com.shine.DBUtil.DBUtil;
import com.shine.DBUtil.model.DBModel;

/**
 * 登陆登出action
 * 
 * @author viruscodecn@gmail.com
 * 
 */
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

	public String login() throws Exception {
		// 项目名称
		this.putRequest("name", GmPlatformManager.getManager().getPluginMap()
				.getPlugin().getProjectName());

		DBModel model = DBUtil.getInstance().executeQuery(
				GmPlatformManager.getManager().getPlatformJndi(),
				"select * from test");
		model.next();
		System.out.println(model.getDataXml());

		return SUCCESS;
	}

	public String logout() throws Exception {
		return SUCCESS;
	}

}
