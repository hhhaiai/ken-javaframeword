package com.shine.framework.Rss;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.Locale;

import com.shine.framework.Rss.model.RssFeedModel;
import com.shine.framework.Rss.model.RssModel;

public class Example {
	public static void main(String args[]) {
		// read
		// RssFeedModel model = RssManager
		// .readRss("http://www.vogella.de/article.rss");
		// System.out.println(model);
		// for (RssModel message : model.getMessages()) {
		// System.out.println(message.getTitle());
		//			
		// }

		// write
		// Create the rss feed
		String copyright = "Copyright hold by Lars Vogel";
		String title = "Eclipse and Java Information";
		String description = "Eclipse and Java Information";
		String language = "en";
		String link = "http://www.vogella.de";
		Calendar cal = new GregorianCalendar();
		Date creationDate = cal.getTime();
		SimpleDateFormat date_format = new SimpleDateFormat(
				"EEE', 'dd' 'MMM' 'yyyy' 'HH:mm:ss' 'Z", Locale.US);
		String pubdate = date_format.format(creationDate);
		RssFeedModel rssFeeder = new RssFeedModel(title, link, description,
				language, copyright, pubdate);

		// Now add one example entry
		RssModel feed = new RssModel();
		feed.setTitle("RSSFeed");
		feed.setDescription("This is a description");
		feed.setAuthor("nonsense@somewhere.de (Lars Vogel)");
		feed.setGuid("http://www.vogella.de/articles/RSSFeed/article.html");
		feed.setLink("http://www.vogella.de/articles/RSSFeed/article.html");
		rssFeeder.getMessages().add(feed);

		RssManager.writeRss(rssFeeder, "articles.rss");
	}
}
