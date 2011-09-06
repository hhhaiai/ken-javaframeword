package com.shine.Sourceview;

public class SourceviewManager {
	private static SourceviewManager manager = null;

	public static SourceviewManager getManager() {
		if (manager == null)
			manager = new SourceviewManager();
		return manager;
	}
}
