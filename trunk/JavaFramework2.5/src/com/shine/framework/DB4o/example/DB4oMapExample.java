package com.shine.framework.DB4o.example;

import java.util.Map;

import com.shine.framework.DB4o.util.DB4oMap;

public class DB4oMapExample {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		DB4oMap<String, Object> map = new DB4oMap<String, Object>();
		// 添加数据
		System.out.println(map.put("key1", "value1"));
		System.out.println(map.put("key1", "value2"));
		System.out.println(map.put("key1", "value3"));
		System.out.println(map.put("key1", "value4"));
		System.out.println(map.put("key2", "value2"));
		System.out.println(map.put("key3", "value3"));
		System.out.println(map.put("key4", "value4"));
		// 检查数据
		System.out.println(map.containsKey("key1"));
		System.out.println(map.containsValue("value1"));
		System.out.println(map.isEmpty());
		// 获取单条数据
		System.out.println(map.get("key2"));
		// 删除单条数据
		System.out.println(map.remove("key1"));
		// 删除所有数据
		map.removeAll("key2");
		// 查询所有数据
		for (Object obj : map.getAll()) {
			System.out.println(obj);
		}
		// 遍历所有键
		for (String key : map.keySet()) {
			System.out.println(key);
		}
		// 遍历所有值
		for (Object value : map.values()) {
			System.out.println(value);
		}
		// 遍历所有的键值对
		for (Map.Entry<String, Object> entry : map.entrySet()) {
			System.out.println(entry.getKey() + " : " + entry.getValue());
		}
//		// 清空所有数据
//		map.clear();
		// 查询总数
		System.out.println(map.size());
		// 释放资源
		map.destroy();
	}

}
