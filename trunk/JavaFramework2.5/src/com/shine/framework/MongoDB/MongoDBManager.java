package com.shine.framework.MongoDB;

import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.mongodb.Mongo;
import com.mongodb.MongoClient;

/**
 * mongoDB 操作类
 * 
 * @author viruscodecn@gmail.com
 * @date 2013-10-09
 * 
 */
public class MongoDBManager {
	private static MongoDBManager manager = null;

	private Map<String, Mongo> mongoDBMap = new HashMap<String, Mongo>();

	public static MongoDBManager getManager() {
		if (manager == null)
			manager = new MongoDBManager();
		return manager;
	}

	/**
	 * 加入新的jndi连接
	 * 
	 * @param jndi
	 * @param ip
	 * @param port
	 * @throws UnknownHostException
	 */
	public void addMongoDB(String jndi, String ip, int port)
			throws UnknownHostException {
		if (mongoDBMap.containsKey(jndi)) {
			System.out.println("存在相同的jndi:" + jndi);
		} else {
			Mongo mg = new MongoClient("localhost", 27017);
			mongoDBMap.put(jndi, mg);
		}
	}

	/**
	 * 获取所有db名称链表
	 * 
	 * @param jndi
	 * @return
	 */
	public List<String> getAllDB(String jndi) {
		if (mongoDBMap.containsKey(jndi)) {
			return mongoDBMap.get(jndi).getDatabaseNames();
		}
		return null;
	}

	/**
	 * 获取所有colletion名称
	 * 
	 * @param jndi
	 * @param dbName
	 * @return
	 */
	public Set<String> getAllCollectionNames(String jndi, String dbName) {
		if (mongoDBMap.containsKey(jndi)) {
			if (mongoDBMap.get(jndi).getDatabaseNames().contains(dbName)) {
				return mongoDBMap.get(jndi).getDB(dbName).getCollectionNames();
			}
		}
		return null;
	}

	/**
	 * 获取map
	 * 
	 * @return
	 */
	public Map<String, Mongo> getMongoDBMap() {
		return mongoDBMap;
	}
}
