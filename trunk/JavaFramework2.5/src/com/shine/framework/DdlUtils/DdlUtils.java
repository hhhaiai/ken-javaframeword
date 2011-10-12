package com.shine.framework.DdlUtils;

import javax.sql.DataSource;

import org.apache.commons.beanutils.DynaBean;
import org.apache.ddlutils.Platform;
import org.apache.ddlutils.PlatformFactory;
import org.apache.ddlutils.io.DatabaseIO;
import org.apache.ddlutils.model.Database;

/**
 * 一个很小型的易用的组件，用于操作数据库定义文件——DDL
 * 
 * @author viruscodecn@gmail.com
 * @url http://db.apache.org/ddlutils/api-usage.html#Reading+from+XML
 * 
 */
public class DdlUtils {
	/**
	 * 读取xml file
	 * 
	 * @param fileName
	 * @return
	 */
	public static Database readDatabaseFromXML(String fileName) {
		return new DatabaseIO().read(fileName);
	}

	// public static void writeDatabaseToXML(Database db, String fileName) {
	// new DatabaseIO().write(db, fileName);
	// }

	/**
	 * 读取数据库的model
	 */
	public static Database readDatabase(DataSource dataSource) {
		Platform platform = PlatformFactory
				.createNewPlatformInstance(dataSource);

		return platform.readModelFromDatabase("model");
	}

	/**
	 * 修改数据库
	 * 
	 * @param dataSource
	 * @param targetModel
	 * @param alterDb
	 */
	public static void changeDatabase(DataSource dataSource,
			Database targetModel, boolean alterDb) {
		Platform platform = PlatformFactory
				.createNewPlatformInstance(dataSource);

		if (alterDb) {
			platform.alterTables(targetModel, false);
		} else {
			platform.createTables(targetModel, true, false);
		}
	}

	/**
	 * 插入数据表
	 * 
	 * @param dataSource
	 * @param database
	 */
	public void insertData(DataSource dataSource, Database database) {
		Platform platform = PlatformFactory
				.createNewPlatformInstance(dataSource);

		// "author" is a table of the model
		DynaBean author = database.createDynaBeanFor("author", false);

		// "name" and "whatever" are columns of table "author"
		author.set("name", "James");
		author.set("whatever", new Integer(1234));

		platform.insert(database, author);
	}
}
