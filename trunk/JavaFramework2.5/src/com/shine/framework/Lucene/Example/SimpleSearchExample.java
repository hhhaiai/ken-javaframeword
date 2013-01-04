package com.shine.framework.Lucene.Example;

import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.util.Version;

import com.shine.framework.Lucene.LuceneManager;

/**
 * 单字符搜索
 * 
 * @author Ken
 * 
 */
public class SimpleSearchExample {

	/**
	 * @param args
	 * @throws Exception
	 */
	public static void main(String[] args) throws Exception {
		LuceneManager
				.getManager()
				.simpleQuery(
						"E:\\JavaWorkSpace\\JavaFramework2.5\\src\\com\\shine\\framework\\Lucene\\data\\index",
						new StandardAnalyzer(Version.LUCENE_36), "中国");

	}

}
