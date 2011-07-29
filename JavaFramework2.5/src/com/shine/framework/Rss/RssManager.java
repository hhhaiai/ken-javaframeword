package com.shine.framework.Rss;

import com.shine.framework.Rss.model.RssFeedModel;
import com.shine.framework.Rss.utils.RSSFeedParser;
import com.shine.framework.Rss.utils.RSSFeedWriter;

public class RssManager {
	public static RssFeedModel readRss(String url) {
		RSSFeedParser parser = new RSSFeedParser(url);
		return parser.readFeed();
	}

	public static boolean writeRss(RssFeedModel rssModel, String url) {
		RSSFeedWriter writer = new RSSFeedWriter(rssModel, url);
		try {
			writer.write();
			return true;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return false;
	}
}
