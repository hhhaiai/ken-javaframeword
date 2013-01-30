package com.shine.common.sysmgr.dao;

import java.util.List;

import com.shine.common.sysmgr.entity.SysFunctionUrl;
import com.shine.common.sysmgr.entity.SysMenu;
import com.shine.common.sysmgr.entity.SysUser;
import com.shine.framework.dao.BaseDao;

public interface LoginDao extends BaseDao{
	
	/**
	 * 通过用户名查询
	 * @param username
	 * @return
	 */
	public abstract SysUser getByUsername(String username);
	
	/**
	 * 通过用户ID查询菜单权限
	 * @param userId
	 * @return
	 */
	public abstract List<SysMenu> loadMenusByUserId(int userId);
	
	/**
	 * 通过用户ID查询URL权限
	 * @param userId
	 * @return
	 */
	public abstract List<SysFunctionUrl> loadFunctionUrlsByUserId(int userId);
}
