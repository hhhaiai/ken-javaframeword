package com.shine.framework.OOWeb;

/**
 * 
 * @author viruscodecn@gmail.com
 * @lib pygmy-core-ooweb.jar;pygmy-handlers.jar
 */
public class OOWebManager {
	private static OOWebManager manager = new OOWebManager();

	public static OOWebManager getManager() {
		return manager;
	}
}
