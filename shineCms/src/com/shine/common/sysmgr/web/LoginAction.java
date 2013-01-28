package com.shine.common.sysmgr.web;

import com.shine.common.sysmgr.biz.SysUserService;
import com.shine.common.sysmgr.entity.SysUser;
import com.shine.framework.entity.PersistResult;
import com.shine.framework.web.GenericAction;
import com.shine.platform.security.encrypt.UserPassGenerator;

public class LoginAction extends GenericAction{
	
	private static final long serialVersionUID = 7886534232444640497L;
	
	//密码加密接口
	private UserPassGenerator userPassGenerator;
	
	private SysUserService service;
	
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
			SysUser user = new SysUser();
			user.setUsername(username);
			user.setPassword(password);
			PersistResult pr = service.login(username, userPassGenerator.generatePassword(user));
			
			/**
			 * 设置session吧
			 */
			
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
		
	}
	
	/**
	 * 进入首页
	 * @return
	 */
	public String home(){
		
		return "home";
	}

	public SysUserService getService() {
		return service;
	}

	public void setService(SysUserService service) {
		this.service = service;
	}

	public UserPassGenerator getUserPassGenerator() {
		return userPassGenerator;
	}

	public void setUserPassGenerator(UserPassGenerator userPassGenerator) {
		this.userPassGenerator = userPassGenerator;
	}
	
}
