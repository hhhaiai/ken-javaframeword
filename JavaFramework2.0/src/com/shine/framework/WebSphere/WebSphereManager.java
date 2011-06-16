package com.shine.framework.WebSphere;

public class WebSphereManager {
	private static WebSphereManager manager = new WebSphereManager();

	public static WebSphereManager getManager() {
		return manager;
	}
}
