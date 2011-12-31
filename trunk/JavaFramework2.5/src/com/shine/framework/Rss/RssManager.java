package com.shine.framework.Rss;

import com.shine.framework.Rss.model.RssFeedModel;
import com.shine.framework.Rss.utils.RSSFeedParser;
import com.shine.framework.Rss.utils.RSSFeedWriter;

/**
 * Rss管理器
 * 
 * @author viruscodecn@gmail.com
 * 
 */
public class RssManager {
	/**
	 * 读取rss
	 * 
	 * @param url
	 * @return
	 */
	public static RssFeedModel readRss(String url) {
		RSSFeedParser parser = new RSSFeedParser(url);
		return parser.readFeed();
	}

	/**
	 * 输出Rss
	 * 
	 * @param rssModel
	 * @param url
	 * @return
	 */
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
