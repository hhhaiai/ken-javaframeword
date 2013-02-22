package com.shine.common.sysmgr.web;

import com.shine.common.sysmgr.biz.LoginService;
import com.shine.framework.entity.PersistResult;
import com.shine.framework.web.GenericAction;
import com.shine.platform.context.ConfigFactory;
import com.shine.platform.security.encrypt.UserPassGenerator;

public class LoginAction extends GenericAction{
	
	private static final long serialVersionUID = 7886534232444640497L;
	
	//密码加密接口
	private UserPassGenerator userPassGenerator;
	
	private LoginService service;
	
	/**
	 * 进入登录页
	 * @return
	 */
	public String enter(){
		
		return "enter";
	}
	
	/**
	 * 登录
	 */
	public void in(){
		try{
			String username = extor.getValue("username");
			String password = extor.getValue("password");
			if(username==null||username.length()<1||password==null||password.length()<1)
				printOutText(new PersistResult(PersistResult.ERROR, "帐号或密码为空").toJson());
			com.shine.platform.security.auth.User user = (com.shine.platform.security.auth.User)ConfigFactory.getFactory().getSpringContext().getBean("sysUser");
			user.setUsername(username);
			user.setPassword(password);
			PersistResult pr = service.login(username, userPassGenerator.generatePassword(user));
			
			//登录成功
			if(pr.getCode()==PersistResult.SUCCESS){
				session.setAttribute(ConfigFactory.SESSION_CURRENT_USER, pr.getData("user"));
				session.setAttribute(ConfigFactory.SESSION_CURRENT_MENUS, pr.getData("menus"));
				session.setAttribute(ConfigFactory.SESSION_CURRENT_URLS, pr.getData("urls"));
			}
			
			//设置成null，避免JSON打印异常
			pr.setDatas(null);
			printOutText(pr.toJson());
		}catch(Exception e){
			e.printStackTrace();
			printOutText(new PersistResult(PersistResult.ERROR, PersistResult.MSG_ERROR).toJson());
		}
	}
	
	/**
	 * 退出登录
	 */
	public void out(){
		session.removeAttribute(ConfigFactory.SESSION_CURRENT_USER);
		session.removeAttribute(ConfigFactory.SESSION_CURRENT_MENUS);
		session.removeAttribute(ConfigFactory.SESSION_CURRENT_URLS);
	}
	
	/**
	 * 进入首页
	 * @return
	 */
	public String home(){
		
		return "home";
	}

	public LoginService getService() {
		return service;
	}

	public void setService(LoginService service) {
		this.service = service;
	}

	public UserPassGenerator getUserPassGenerator() {
		return userPassGenerator;
	}

	public void setUserPassGenerator(UserPassGenerator userPassGenerator) {
		this.userPassGenerator = userPassGenerator;
	}
	
}
