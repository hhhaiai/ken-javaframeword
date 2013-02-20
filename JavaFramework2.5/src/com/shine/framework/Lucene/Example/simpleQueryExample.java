package com.shine.framework.Lucene.Example;

import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.util.Version;
import com.shine.framework.Lucene.LuceneManager;

/**
 * 多关键字检索
 * 
 * @author Ken
 * 
 */
public class simpleQueryExample {
	
	public static void main(String[] args) throws Exception {
		String str[]={"2062080411740","127.0.0.1"};//多关键字
		LuceneManager
		.getManager()
		.simpleQuery("D:\\MyEclipse 8.5\\luceneTest\\",new StandardAnalyzer(Version.LUCENE_36),str);
	}
}
