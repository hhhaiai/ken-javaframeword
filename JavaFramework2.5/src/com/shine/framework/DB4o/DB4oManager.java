package com.shine.framework.DB4o;

public class DB4oManager {
	private static DB4oManager manager = null;

	public static DB4oManager getManager() {
		if (manager == null)
			manager = new DB4oManager();
		return manager;
	}
	
	
}
