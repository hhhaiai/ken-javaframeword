package com.shine.framework.Lucene.Example;

import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.util.Version;
import com.shine.framework.Lucene.LuceneManager;
/**
 * 复合索引路径检索
 * 
 * @author Ken
 * 
 */
public class complexIndexQueryExample {
	private static String indexPath1 = "D:\\MyEclipse 8.5\\luceneTest\\";
	private static String indexPath2 = "D:\\MyEclipse 8.5\\framework\\";

	public static void main(String[] args) throws Exception {

		String keyWord = "stkk_element_connexity";// 关键字
		String indexDirPath[] = { indexPath1, indexPath2 };// 复合索引路径
		
		LuceneManager.getManager().complexIndexQuery(
				new StandardAnalyzer(Version.LUCENE_36), keyWord, indexDirPath);
	}
}
