package com.shine.platform.tld;

import com.shine.platform.PlatformManager;

public class PlatformInfoTld {
	/**
	 * 获取项目信息
	 * 
	 * @return
	 */
	public static String getProjectName() {
		return PlatformManager.getManager().getProjectName();
	}	
}
