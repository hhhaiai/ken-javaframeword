package com.shine.framework.Lucene.Example;

import com.shine.framework.Lucene.LuceneManager;

public class CreateIndexExample {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		LuceneManager.getManager().createIndex(
				"C:/Users/Dragon/Desktop/Lucene/data/index",
				"C:/Users/Dragon/Desktop/Lucene/data/documents");

	}

}
