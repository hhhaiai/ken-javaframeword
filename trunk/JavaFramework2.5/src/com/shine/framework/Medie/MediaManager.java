package com.shine.framework.Medie;

public class MediaManager {
	private static MediaManager manager = null;

	public static MediaManager getManager() {
		if (manager != null)
			manager = new MediaManager();
		return manager;
	}
	
	
}
