package com.shine.common.sysmgr.dao.impl;

import java.util.List;

import com.shine.common.sysmgr.dao.SysUserDao;
import com.shine.common.sysmgr.entity.SysFunction;
import com.shine.common.sysmgr.entity.SysMenu;
import com.shine.common.sysmgr.entity.SysUser;
import com.shine.framework.dao.impl.BaseDaoImpl;

public class SysUserDaoImpl extends BaseDaoImpl implements SysUserDao{

	@Override
	public SysUser getByUsername(String username) {
		return (SysUser)this.findOne("from SysUser u where u.username=?", new Object[]{username});
	}

	@Override
	public List<SysMenu> loadMenusByUserId(int userId) {
		String sql = "select m.* from SYS_MENU m left join SYS_ROLE_MENU rm on m.MENUID = rm.MENUID left join SYS_USER_ROLE ur on rm.ROLEID = ur.ROLEID where ur.USERID=? and m.ENABLE=1 order by m.ORDERID asc";
		return this.listBySQL(SysMenu.class, sql, new Object[]{userId});
	}

	@Override
	public List<SysFunction> loadFuncsByUserId(int userId) {
		String sql = "select f.* from SYS_FUNCTION f left join SYS_ROLE_FUNCTION rf on f.FUNID = rf.FUNID left join SYS_USER_ROLE ur on rf.ROLEID = ur.ROLEID where ur.USERID=? order by f.ORDERID asc";
		return this.listBySQL(SysFunction.class, sql, new Object[]{userId});
	}
	
}
