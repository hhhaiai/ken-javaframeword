package com.shine.common.sysmgr.biz.impl;

import java.util.List;

import org.hibernate.Hibernate;

import com.shine.common.sysmgr.biz.LoginService;
import com.shine.common.sysmgr.dao.LoginDao;
import com.shine.common.sysmgr.entity.SysFunctionUrl;
import com.shine.common.sysmgr.entity.SysMenu;
import com.shine.framework.biz.impl.GenericServiceImpl;
import com.shine.framework.entity.PersistResult;

public class LoginServiceImpl extends GenericServiceImpl<LoginDao> implements LoginService{

	@Override
	public PersistResult login(String username,String password) {
		PersistResult pr = new PersistResult();
		com.shine.platform.security.auth.User user = dao.getByUsername(username);
		if(user==null){
			pr.setCode(PersistResult.FAILURE);
			pr.setMsg("帐号不存在");
			return pr;
		}
		if(!user.getPassword().equals(password)){
			pr.setCode(PersistResult.FAILURE);
			pr.setMsg("帐号或密码错误");
			return pr;
		}
		pr.setCode(PersistResult.SUCCESS);
		pr.setMsg("登录成功");
		pr.putData("user", user);
		
		List<SysMenu> menus = dao.loadMenusByUserId(user.getUserId());
		List<SysFunctionUrl> urls = dao.loadFunctionUrlsByUserId(user.getUserId());
		
		//使功能和SysMenu强制加载
		if(urls!=null){
			for(SysFunctionUrl url : urls){
				Hibernate.initialize(url.getFunc().getSysMenu());
			}
		}
		
		pr.putData("menus", menus);
		pr.putData("urls", urls);
		return pr;
	}
	
}
