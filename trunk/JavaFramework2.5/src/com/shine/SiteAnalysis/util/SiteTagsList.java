package com.shine.SiteAnalysis.util;

import java.net.URL;
import java.util.ArrayList;
import java.util.List;

import com.shine.framework.HtmlManager.HtmlManager;
import com.shine.framework.HtmlManager.model.HtmlBaseModel;
import com.shine.framework.core.util.DataUtil;
import com.shine.framework.core.util.HtmlUtil;

public class SiteTagsList extends ArrayList<HtmlBaseModel> {
	private List<String> herfList;
	private String hostName;
	private String tag;
	private String siteUrl;

	public void getAllTag(String siteUrl, String tag) throws Exception {
		if (!DataUtil.isNull(siteUrl) && !DataUtil.isNull(tag)) {
			this.hostName = new URL(siteUrl).getHost();
			this.siteUrl = siteUrl;
			this.tag = tag;
			this.herfList = new ArrayList<String>();
			getAllTagR(siteUrl, tag);
		}
	}

	private void getAllTagR(String siteUrl, String tag) {
		if (HtmlUtil.urlBlong(hostName, siteUrl)
				&& !this.herfList.contains(siteUrl)) {
			System.out.println(siteUrl);
			this.herfList.add(siteUrl);
			try {
				HtmlManager helper = new HtmlManager(HtmlUtil
						.getUrlString(siteUrl));
				List<HtmlBaseModel> list = helper.getTag(tag);
				for (HtmlBaseModel b : list) {
					this.add(b);
				}
				list = null;

				List<HtmlBaseModel> aList = helper.getTag("a");
				for (HtmlBaseModel b : aList) {
					getAllTagR(b.get("href"), tag);
				}
				aList = null;
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}

	public List<String> getHerfList() {
		return herfList;
	}
}
