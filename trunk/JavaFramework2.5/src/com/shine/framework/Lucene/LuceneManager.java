package com.shine.framework.Lucene;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStreamReader;

import org.apache.lucene.analysis.Analyzer;
import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.document.Document;
import org.apache.lucene.document.Field;
import org.apache.lucene.index.IndexReader;
import org.apache.lucene.index.IndexWriter;
import org.apache.lucene.index.IndexWriterConfig;
import org.apache.lucene.queryParser.QueryParser;
import org.apache.lucene.search.IndexSearcher;
import org.apache.lucene.search.Query;
import org.apache.lucene.search.ScoreDoc;
import org.apache.lucene.search.TopDocs;
import org.apache.lucene.store.Directory;
import org.apache.lucene.store.FSDirectory;
import org.apache.lucene.util.Version;
import org.apache.lucene.util.packed.PackedInts.ReaderImpl;

public class LuceneManager {
	private static LuceneManager manager = null;

	public static LuceneManager getManager() {
		if (manager == null)
			manager = new LuceneManager();

		return manager;
	}

	/**
	 * 建立索引
	 * 
	 * @param indexDirPath
	 * @param docmentDirPath
	 */
	public void createIndex(String indexDirPath, String docmentDirPath) {
		createIndex(indexDirPath, docmentDirPath, "utf-8");
	}

	/**
	 * 建立数据库检索
	 * 
	 * @param jndi
	 * @param indexDirPath
	 */
	public void createDBIndex(String jndi, String indexDirPath) {

	}

	/**
	 * 建立索引
	 * 
	 * @param indexDirPath
	 * @param docmentDirPath
	 * @param ecoding
	 */
	public void createIndex(String indexDirPath, String docmentDirPath,
			String ecoding) {
		try {
			createIndex(indexDirPath, docmentDirPath, ecoding,
					new StandardAnalyzer(Version.LUCENE_36));
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	/**
	 * 建立索引
	 * 
	 * @param indexDirPath
	 *            索引所放的位置
	 * @param docmentDirPath
	 *            索引文件路径
	 * @param ecoding
	 *            编码
	 * @param luceneAnalyzer
	 *            分析器
	 */
	public void createIndex(String indexDirPath, String docmentDirPath,
			String ecoding, Analyzer luceneAnalyzer) throws Exception {
		// 需要的分词器
		Directory dir = FSDirectory.open(new File(indexDirPath));

		// 创建的是哪个版本的IndexWriterConfig
		IndexWriterConfig conf = new IndexWriterConfig(Version.LUCENE_36,
				new StandardAnalyzer(Version.LUCENE_36));
		IndexWriter iw = new IndexWriter(dir, conf);

		File file = new File(docmentDirPath);
		for (int i = 0; i < file.listFiles().length; i++) {
			System.out.println("建立文件" + i + 1 + "的索引");
			File f = file.listFiles()[i];
			// 创建Document对象
			System.out.println(f);
			Document doc = new Document();
			doc.add(new Field("body", fileReaderAll(f.getCanonicalPath(),
					ecoding), Field.Store.YES, Field.Index.ANALYZED,
					Field.TermVector.WITH_POSITIONS_OFFSETS));
			doc.add(new Field("name", f.getName(), Field.Store.YES,
					Field.Index.ANALYZED));
			doc.add(new Field("path", f.getAbsolutePath(), Field.Store.YES,
					Field.Index.NOT_ANALYZED));
			iw.addDocument(doc);
		}
		System.out.println("建立索引完毕");
		if (iw != null) {
			iw.close();
		}

	}

	/**
	 * 简单搜索
	 * 
	 * @param indexDirPath
	 * @param luceneAnalyzer
	 * @param keyWord
	 */
	public void simpleQuery(String indexDirPath, Analyzer luceneAnalyzer,
			String keyWord) throws Exception {
		Directory dir = FSDirectory.open(new File(indexDirPath));
		IndexReader ir = IndexReader.open(dir);
		IndexSearcher srch = new IndexSearcher(ir);
		QueryParser parser = new QueryParser(Version.LUCENE_36, "name",
				luceneAnalyzer);
		Query query = parser.parse(keyWord);
		TopDocs tds = srch.search(query, 10000);
		ScoreDoc[] sds = tds.scoreDocs;
		System.out.println(sds.length);
		for (int i = 0; i < sds.length; i++) {
			// 根据Searcher和ScoreDoc获取具体Document
			Document doc = srch.doc(sds[i].doc);
			// 根据Document获取需要的值
			System.out.println(doc.get("name") + " | " + doc.get("path"));
		}
		if (ir != null) {
			ir.close();
		}
		if (srch != null) {
			srch.close();
		}
	}

	/**
	 * 复合索引检索
	 * 
	 * @param indexDirPath
	 * @param luceneAnalyzer
	 * @param keyWord
	 * @throws Exception
	 */
	public void complexIndexQuery(Analyzer luceneAnalyzer, String keyWord,
			String... indexDirPath) throws Exception {

	}

	/**
	 * 多关键字检索
	 * 
	 * @param indexDirPath
	 * @param luceneAnalyzer
	 * @param keyWord
	 * @throws Exception
	 */
	public void simpleQuery(String indexDirPath, Analyzer luceneAnalyzer,
			String... keyWord) throws Exception {

	}

	private String fileReaderAll(String FileName, String charset)
			throws IOException {
		BufferedReader reader = new BufferedReader(new InputStreamReader(
				new FileInputStream(FileName), charset));
		String line = new String();
		String temp = new String();

		while ((line = reader.readLine()) != null) {
			temp += line;
		}
		reader.close();
		return temp;
	}

}
