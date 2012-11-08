package com.shine.framework.Lucene;

public class LuceneManager {
	private static LuceneManager manager = null;

	public static LuceneManager getManager() {
		if (manager == null)
			manager = new LuceneManager();

		return manager;
	}
}
