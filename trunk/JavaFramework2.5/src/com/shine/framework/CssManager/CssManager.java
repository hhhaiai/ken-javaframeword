package com.shine.framework.CssManager;

public class CssManager {
	private static CssManager manager = null;

	public static CssManager getManager() {
		if (manager == null)
			manager = new CssManager();
		return manager;
	}
	
	
}
