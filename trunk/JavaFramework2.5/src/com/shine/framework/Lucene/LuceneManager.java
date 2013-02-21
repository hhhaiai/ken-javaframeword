package com.shine.framework.Lucene;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import org.apache.lucene.analysis.Analyzer;
import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.document.Document;
import org.apache.lucene.document.Field;
import org.apache.lucene.index.CorruptIndexException;
import org.apache.lucene.index.IndexReader;
import org.apache.lucene.index.IndexWriter;
import org.apache.lucene.index.IndexWriterConfig;
import org.apache.lucene.queryParser.MultiFieldQueryParser;
import org.apache.lucene.queryParser.QueryParser;
import org.apache.lucene.search.BooleanClause;
import org.apache.lucene.search.IndexSearcher;
import org.apache.lucene.search.MultiSearcher;
import org.apache.lucene.search.Query;
import org.apache.lucene.search.ScoreDoc;
import org.apache.lucene.search.TopDocs;
import org.apache.lucene.store.Directory;
import org.apache.lucene.store.FSDirectory;
import org.apache.lucene.util.Version;
import com.shine.DBUtil.manage.DBManager;

@SuppressWarnings("deprecation")
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
	public void createDBIndex(String jndi, String indexDirPath)throws Exception {
		Directory dir = FSDirectory.open(new File(indexDirPath));
		IndexWriterConfig conf = new IndexWriterConfig(Version.LUCENE_36,new StandardAnalyzer(Version.LUCENE_36));// 创建的是哪个版本的IndexWriterConfig
		IndexWriter iw = new IndexWriter(dir, conf);
		
		Connection conn = DBManager.getInstance().getConnection(jndi);
		ResultSet rs = conn.getMetaData().getTables(null, null, "%", new String[] { "TABLE" }); //获取全部表名
		
		try {
			while(rs.next()){
			System.out.println("正在建立索引的表名:"+rs.getString(3));
			String tableName=rs.getString(3);
			String sql = "select * from " + tableName;
			ResultSet tableRS= conn.createStatement().executeQuery(sql);//获取单张表信息
		    while(tableRS.next()){
		    	indexDB(tableRS,iw,tableName);
		    }
		    tableRS.close();
		}
		} catch (Exception e) {
			e.printStackTrace();
		}finally{
		if (iw != null) {
		   iw.close();
		}
		if (rs != null) {
			rs.close();
		}
		if (conn != null) {
			conn.close();
		}
		}
		System.out.println("建立数据库索引完毕--------");
	}
	
	public void indexDB(ResultSet tableRS, IndexWriter iw, String tableName) throws SQLException, CorruptIndexException, IOException{
		try {
			String columnContent="";//数据库表字段的内容拼接
			ResultSetMetaData meda=tableRS.getMetaData();
			for(int i=1;i<meda.getColumnCount()+1;i++)
				columnContent +=tableRS.getString(meda.getColumnName(i));
			System.out.println(tableName+"表的字段内容:"+columnContent);
			Document doc = new Document(); 
			Field body=new Field("body",columnContent,Field.Store.YES, Field.Index.ANALYZED,
					Field.TermVector.WITH_POSITIONS_OFFSETS);
			Field name=new Field("name", tableName, Field.Store.YES, Field.Index.ANALYZED,
					Field.TermVector.WITH_POSITIONS_OFFSETS);
			doc.add(name);
			doc.add(body);
			iw.addDocument(doc);
			
			doc=null;
			name=null;
			body=null;
			meda=null;
		} catch (Exception e) {
			e.printStackTrace();
		}
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
			try {
				File f = file.listFiles()[i];
				Document doc = new Document();
				doc.add(new Field("body", fileReaderAll(f.getCanonicalPath(),
						ecoding), Field.Store.YES, Field.Index.ANALYZED,
						Field.TermVector.WITH_POSITIONS_OFFSETS));
				doc.add(new Field("name", f.getName(), Field.Store.YES,
						Field.Index.ANALYZED));
				doc.add(new Field("path", f.getAbsolutePath(), Field.Store.YES,
						Field.Index.NOT_ANALYZED));
				iw.addDocument(doc);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
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
		try {
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
				Document doc = srch.doc(sds[i].doc);
				System.out.println(doc.get("name") + " | " + doc.get("path"));
			}
			if (ir != null) {
				ir.close();
			}
			if (srch != null) {
				srch.close();
			}
		} catch (Exception e) {
			e.printStackTrace();
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
		  try {
				IndexSearcher[] searchers = new IndexSearcher[indexDirPath.length];
				for(int i=0;i<searchers.length;i++)
				searchers[i] = new IndexSearcher(FSDirectory.open(new File(indexDirPath[i])));//多索引路径搜索
	            MultiSearcher searcher = new MultiSearcher(searchers);
	            String fields[]={"name"};
	            BooleanClause.Occur[] flags = new BooleanClause.Occur[] {BooleanClause.Occur.MUST};
	            Query   query = MultiFieldQueryParser.parse(Version.LUCENE_36,keyWord,fields,flags,luceneAnalyzer);
	            ScoreDoc[] score = searcher.search(query, 10000).scoreDocs;
	            System.out.println("搜索出来的文件数:"+score.length);
	            for (int i = 0; i < score.length; i++) {
	                Document hitDoc = searcher.doc(score[i].doc);
	                System.out.print("name: " + hitDoc.get("name") + "    ");
	                System.out.print("body: " + hitDoc.get("body") + "    ");
	                System.out.print("\n");
	            }
	        } catch (Exception e) {
	        	e.printStackTrace();
	        }
	}
	
	/**
	 * 多关键字检索
	 * 
	 * @param indexDirPath
	 * @param luceneAnalyzer
	 * @param keyWord
	 * @throws Exception
	 */
	public void simpleQuery(String indexDirPath, Analyzer luceneAnalyzer,String... keyWord) throws Exception {

		IndexReader ir = IndexReader.open(FSDirectory.open(new File(indexDirPath)));
		IndexSearcher srch = new IndexSearcher(ir);
//		String[] fields={"name","body"};
		String[] fields = new String[keyWord.length];
		for(int j=0;j<fields.length;j++)fields[j]="body";
		Query query = MultiFieldQueryParser.parse(Version.LUCENE_36, keyWord,fields, luceneAnalyzer);
		TopDocs tds = srch.search(query, 10000);
		ScoreDoc[] sds = tds.scoreDocs;
		System.out.println(sds.length);
		for (int i = 0; i < sds.length; i++) {
			Document doc = srch.doc(sds[i].doc);
			System.out.println(doc.get("name"));
			System.out.println(doc.get("body"));
		}
		if (ir != null) {
			ir.close();
		}
		if (srch != null) {
			srch.close();
		}
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
