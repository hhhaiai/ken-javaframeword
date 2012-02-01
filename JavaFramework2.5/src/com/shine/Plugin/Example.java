package com.shine.Plugin;

public class Example {

	/**
	 * 插件的基础例子
	 * 
	 * @param args
	 */
	public static void main(String[] args) {
		TestPlugin testPlugin = new TestPlugin();
		PluginManager.getManager().loadPlugin(testPlugin);
		System.out.println(testPlugin.printPluginStatus());
	}
}
