package com.shine.common.sysmgr.biz.impl;

import java.util.List;

import org.hibernate.Hibernate;

import com.shine.common.sysmgr.biz.SysUserService;
import com.shine.common.sysmgr.dao.SysUserDao;
import com.shine.common.sysmgr.entity.SysFunction;
import com.shine.common.sysmgr.entity.SysMenu;
import com.shine.common.sysmgr.entity.SysUser;
import com.shine.framework.biz.impl.GenericServiceImpl;
import com.shine.framework.entity.PersistResult;

public class SysUserServiceImpl extends GenericServiceImpl<SysUserDao> implements SysUserService{

	@Override
	public PersistResult login(String username,String password) {
		PersistResult pr = new PersistResult();
		SysUser user = dao.getByUsername(username);
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
		List<SysFunction> funcs = dao.loadFuncsByUserId(user.getUserId());
		
		//使功能的URL和SysMenu强制加载
		if(funcs!=null){
			for(SysFunction func : funcs){
				Hibernate.initialize(func.getUrls());
				Hibernate.initialize(func.getSysMenu());
			}
		}
		
		pr.putData("menus", menus);
		pr.putData("funcs", funcs);
		return pr;
	}
	
}
