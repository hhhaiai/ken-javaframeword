package com.shine.framework.Webmagic.Examples;

import java.util.List;

import us.codecraft.webmagic.Site;
import us.codecraft.webmagic.Spider;

@TargetUrl("http://my.oschina.net/flashsword/blog/\\d+")
public class Example {
	@ExtractBy("//title")
	private String title;

	@ExtractBy(value = "div.BlogContent", type = ExtractBy.Type.Css)
	private String content;

	@ExtractBy(value = "//div[@class='BlogTags']/a/text()", multi = true)
	private List<String> tags;

	public static void main(String[] args) {
		Spider.create(
				Site.me().addStartUrl("http://my.oschina.net/flashsword/blog"),
				new ConsolePageModelPipeline(), Example.class).scheduler(
				new RedisScheduler("127.0.0.1")).thread(5).run();
	}

}
