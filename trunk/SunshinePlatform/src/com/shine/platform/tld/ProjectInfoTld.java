package com.shine.platform.tld;

import com.shine.Plugin.PluginManager;
import com.shine.platform.PlatformManager;
import com.shine.platform.interfaces.PageIf;

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

	/**
	 * 获取工程pagepath
	 * 
	 * @return
	 */
	public static String getPageType() {
		return PlatformManager.getManager().getProjectPlugin().getPageType();
	}

	public static String getIndexPage() {
		StringBuffer buffer = new StringBuffer();
		try {
			buffer.append(PluginManager.getManager().getPlugin(PageIf.class)
					.getPage(
							PlatformManager.getManager().getProjectPlugin()
									.getPageType(),
							PlatformManager.getManager().getProjectPlugin()
									.getIndex()));
		} catch (Exception e) {
		}
		return buffer.toString();
	}
}
