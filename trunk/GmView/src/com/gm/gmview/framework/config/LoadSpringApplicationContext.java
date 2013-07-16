package com.gm.gmview.framework.config;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.FileSystemXmlApplicationContext;

import com.gm.gmview.framework.util.ApplicationContextUtil;

/**
 * 动态加载context
 * 
 * @author viruscodecn@gmail.com
 * 
 */
public class LoadSpringApplicationContext {
	public static void loadSpringApplicationContext(String... paths) {
		ApplicationContext ctx = new FileSystemXmlApplicationContext(paths);
		ApplicationContextUtil.setContext(ctx);
	}
}
