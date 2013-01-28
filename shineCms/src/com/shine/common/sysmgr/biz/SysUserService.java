package com.shine.common.sysmgr.biz;

import com.shine.framework.entity.PersistResult;

public interface SysUserService {
	
	public PersistResult login(String username,String password);
	
}
