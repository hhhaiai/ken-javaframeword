package com.shine.SiteAnalysis.Example;


import com.shine.SiteAnalysis.SiteAnalysisManager;
import com.shine.SiteAnalysis.util.SiteTagsList;

public class GetSiteAllTagExample {

	/**
	 * @param args
	 * @throws MalformedURLException
	 */
	public static void main(String[] args) throws Exception {
		SiteTagsList list = SiteAnalysisManager.gerManager().getAllTag(
				"http://www.cnbeta.com/", "img");
		System.out.println(list.size());
	}

}
