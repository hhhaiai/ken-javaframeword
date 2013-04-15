package com.shine.SiteAnalysis;

import com.shine.SiteAnalysis.util.SiteTagsList;

public class SiteAnalysisManager {
	private static SiteAnalysisManager manager = null;

	public static SiteAnalysisManager gerManager() {
		if (manager == null)
			manager = new SiteAnalysisManager();
		return manager;
	}

	/**
	 * 获取网站所有标签
	 * 
	 * @param siteUrl
	 * @param tag
	 * @throws Exception
	 */
	public SiteTagsList getAllTag(String siteUrl, String tag) throws Exception {
		SiteTagsList list = new SiteTagsList();
		list.getAllTag(siteUrl, tag);
		return list;
	}
}
