package com.shine.platform.tld;

import com.shine.Plugin.PluginManager;
import com.shine.platform.PlatformManager;
import com.shine.platform.interfaces.PageIf;

public class PageTld {
	/**
	 * 页面获取
	 * 
	 * @param pageName
	 * @return
	 */
	public static String getPageName(String pageName) {
		StringBuffer buffer = new StringBuffer();
		buffer.append("/SunshinePlatform");
		try {
			buffer.append(PluginManager.getManager().getPlugin(PageIf.class)
					.getPage(
							PlatformManager.getManager().getProjectPlugin()
									.getPageType(), pageName));
		} catch (Exception e) {
		}
		return buffer.toString();
	}
}
