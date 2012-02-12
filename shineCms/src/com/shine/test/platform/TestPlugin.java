package com.shine.test.platform;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.shine.platform.plugin.PluginContext;

public class TestPlugin {
	public static void main(String[] args) {
		ApplicationContext context = new ClassPathXmlApplicationContext("com/shine/platform/platformContext.xml");
		PluginContext pc = (PluginContext)context.getBean("pluginContext");
		System.out.println(pc);
	}
}
