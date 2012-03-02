package com.shine.platform.tld;

import com.shine.platform.PlatformManager;

public class ProjectInfoTld {
	/**
	 * 获取首页信息
	 * 
	 * @return
	 */
	public static String getIndexName() {
		return PlatformManager.getManager().getProjectName();
	}

	/**
	 * 获取logo路径path
	 */
	public static String getLogoImagePath() {
		return PlatformManager.getManager().getProjectPlugin().getLogoPath();
	}
}