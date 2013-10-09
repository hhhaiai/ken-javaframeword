package com.shine.framework.MongoDB.Example;

import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.List;

import org.bson.types.ObjectId;

import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.Mongo;
import com.mongodb.MongoClient;
import com.mongodb.util.JSON;

/**
 * MongDB之CRUD
 * 
 * @author 范晓东
 * @ClassName: TestMongo
 * @Version 1.0
 * @ModifiedBy
 * @Copyright shxt
 * @date 2013-9-27 下午08:21:49
 * @description
 */
public class TestMongo {

	private Mongo mg = null;
	private DB db;
	private DBCollection users;

	public void setUp() throws UnknownHostException {
		// 创建一个MongoDB的数据库连接对象
		mg = new MongoClient("localhost", 27017);
		// 验证模式登录(如果不设置验证模块，可直接登录)
		// 想要登录验证模块生效,需在命令行下输入1->mongo 2->use admin
		// 3->db.addUser("root","root123"); 4->db.auth("root","root123");
		DB admin = mg.getDB("admin");
		boolean bool = admin.authenticate("root", "root123".toCharArray());
		if (bool) {
			// login success
			// 获得一个test的数据库，如果该数据库不存在，会自动创建
			db = mg.getDB("test");
		}
		// 获取一个聚集集合DBCollection,相当于我们的数据库表
		users = db.getCollection("users");
	}

	public void testQuery() {
		// 查询所有的数据库
		for (String name : mg.getDatabaseNames()) {
			System.out.println("dbName: " + name);
		}
		// 查询所有的聚集集合
		for (String name : db.getCollectionNames()) {
			System.out.println("collectionName: " + name);
		}
		// 查询所有的数据
		DBCursor cur = users.find();
		while (cur.hasNext()) {
			System.out.println(cur.next());
		}
		// 其它
		System.out.println(cur.count());
		System.out.println(users.count());
		System.out.println(cur.getCursorId());
		System.out.println(JSON.serialize(cur));// JSON对象转换
	}

	public void testQuery2() {
		// 根据id查询
		List<DBObject> list = users.find(
				new BasicDBObject("_id", new ObjectId(
						"5243871a0609f38c8a7a5ccd"))).toArray();
		System.out.println(list.get(0).get("name"));

		// 根据age查询，从第一条开始取，取3条数据
		BasicDBObject user = new BasicDBObject();
		user.put("age", new BasicDBObject("$gte", 20));
		DBCursor cur = users.find(user).skip(0).limit(3);
		System.out.println(cur.count());
		while (cur.hasNext()) {
			System.out.println(cur.next());
		}

		// 查询age!=25
		// users.find(new BasicDBObject("age", new BasicDBObject("$ne",
		// 25))).toArray();
		// 查询age in 25/26/27
		// users.find(new BasicDBObject("age", new
		// BasicDBObject(QueryOperators.IN, new int[] { 25, 26, 27
		// }))).toArray();
		// 查询age not in 25/26/27
		// users.find(new BasicDBObject("age", new
		// BasicDBObject(QueryOperators.NIN, new int[] { 25, 26, 27
		// }))).toArray();
		// 查询存在age的数据
		// users.find(new BasicDBObject("age", new
		// BasicDBObject(QueryOperators.EXISTS, true))).toArray();
		// 只查询age属性
		// users.find(null, new BasicDBObject("age", true)).toArray();

		// 只查询一条数据，多条取第一条
		// users.findOne();
		// users.findOne(new BasicDBObject("age", 26));
		// users.findOne(new BasicDBObject("age", 26), new BasicDBObject("name",
		// true));

		// 查询age=25的数据并删除
		// users.findAndRemove(new BasicDBObject("age", 25));
		// 查询age=26的数据，并且修改name的值为abc
		// users.findAndModify(new BasicDBObject("age", 26), new
		// BasicDBObject("name", "abc"));
	}

	public void testAdd() {
		DBObject user = new BasicDBObject();
		user.put("name", "fxd");
		user.put("age", 21);
		user.put("sex", "男");
		users.save(user);
		// 查看是否添加成功
		DBCursor cur = users.find();
		while (cur.hasNext()) {
			System.out.println(cur.next());
		}
	}

	public void testAdd2() {
		DBObject user1 = new BasicDBObject("name", "张三");
		DBObject user2 = new BasicDBObject("age", 20);
		users.insert(user1, user2);
		// 查看是否添加成功
		DBCursor cur = users.find();
		while (cur.hasNext()) {
			System.out.println(cur.next());
		}
	}

	public void testAdd3() {
		DBObject user1 = new BasicDBObject("name", "张三");
		DBObject user2 = new BasicDBObject("age", 20);
		List<DBObject> list = new ArrayList<DBObject>();
		list.add(user1);
		list.add(user2);
		users.insert(list);
		// 查看是否添加成功
		DBCursor cur = users.find();
		while (cur.hasNext()) {
			System.out.println(cur.next());
		}
	}

	public void testRemove() {
		users.remove(new BasicDBObject("_id", new ObjectId(
				"524378680609ad5717421c6a")));
		// users.remove(new BasicDBObject("age", new BasicDBObject("$gte",
		// 24)));
	}

	public void update() {
		// =update users set age=17 where name='fxd';
		users.update(new BasicDBObject("name", "fxd"),// new
				// BasicDBObject().append("name","fxd"),
				new BasicDBObject("$set", new BasicDBObject("age", 17)), false,// 如果users中不存在age字段，是否更新，false表示不更新
				false// 只修改第一条，true表示修改多条
				);
	}

	public void update2() {
		// 批量修改，也可以用users.update(),把第四个参数改为true即可
		// =update users set age=age+10 where name='fxd';
		users.updateMulti(new BasicDBObject().append("name", "fxd"),
				new BasicDBObject("$inc", new BasicDBObject("age", 10)));
	}

	public void tearDown() {
		if (mg != null) {
			if (db != null) {
				// 结束Mongo数据库的事务请求
				try {
					db.requestDone();
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
			try {
				mg.close();
			} catch (Exception e) {
				e.printStackTrace();
			}
			mg = null;
			db = null;
		}
	}

	public static void main(String args[]) throws Exception {
		TestMongo t = new TestMongo();
		t.setUp();
	}
}
