package com.shine.framework.DB4o.example;

import java.util.HashMap;
import java.util.Map;

import com.shine.framework.DB4o.util.DB4oMap;

public class DB4oMapExample {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		/**=========== 简单对象存储 ============*/
		DB4oMap<String, Object> map = new DB4oMap<String, Object>(true);
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
		System.out.println(map.remove("key4", "value4"));
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
		// 清空所有数据
		map.clear();
		// 查询总数
		System.out.println(map.size());
		// 释放资源
		map.destroy();
		
		/**=========== 高级对象存储 ============*/
		DB4oMap<String, Map<String, String>> map2 = new DB4oMap<String, Map<String, String>>();
		// 添加数据
		Map<String, String> data1 = new HashMap<String, String>();
		data1.put("data1.key1", "data1.value1");
		data1.put("data1.key2", "data1.value2");
		Map<String, String> data2 = new HashMap<String, String>();
		data2.put("data2.key1", "data2.value1");
		data2.put("data2.key2", "data2.value2");
		Map<String, String> data3 = new HashMap<String, String>();
		data3.put("data3.key1", "data3.value1");
		Map<String, String> data4 = new HashMap<String, String>();
		data4.put("data4.key1", "data4.value1");
		data4.put("data4.key2", "data4.value1");
		data4.put("data4.key3", "data4.value1");
		map2.put("map1", data1);
		map2.put("map2", data2);
		map2.put("map3", data3);
		map2.put("map3", data4);
		// 检查数据
		System.out.println(map2.containsKey("map1"));
		System.out.println(map2.containsValue(data1));
		// 获取单条数据
		System.out.println(map2.get("map1"));
		// 移除单条数据
		System.out.println(map2.remove("map2"));
		// 移除指定键值对
		System.out.println(map2.remove("map1", data1));
		// 遍历所有键
		for (String key : map2.keySet()) {
			System.out.println(key);
		}
		// 遍历所有的键值对
		for (Map.Entry<String, Map<String, String>> entry : map2.entrySet()) {
			System.out.println(entry.getKey() + " : " + entry.getValue());
		}
		// 遍历所有的数据
		for (Map<String, String> datas : map2.getAll()) {
			for (Map.Entry<String, String> entry : datas.entrySet()) {
				System.out.println(entry.getKey() + ":" + entry.getValue());
			}
		}
		// 清空所有数据
		map2.clear();
		// 查询总数
		System.out.println(map2.size());
		map2.destroy();
	}

}
