package com.shine.framework.Lucene.Example;

import com.shine.DBUtil.manage.DBManager;
import com.shine.framework.Lucene.LuceneManager;
/**
 * 建立数据库索引
 * 
 * @author Ken
 * 
 */
public class createDBIndexExample {

	public static void main(String[] args) throws Exception {
        //nms4是数据库名,初始化数据库连接池
		DBManager.getInstance().initMysqlJndi("nms4", "localhost", "3306","nms4", "root", "root");
		// 建立索引
		String indexPath = "D:\\MyEclipse 8.5\\luceneTest\\";
		LuceneManager.getManager().createDBIndex("nms4", indexPath);
	}
}
