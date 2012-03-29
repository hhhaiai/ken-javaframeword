package com.shine.ShareServer;

public class ShareServerManager {
	private static ShareServerManager manager = null;

	public static ShareServerManager getManager() {
		if (manager == null)
			manager = new ShareServerManager();
		return manager;
	}
	
	
	
	
}
