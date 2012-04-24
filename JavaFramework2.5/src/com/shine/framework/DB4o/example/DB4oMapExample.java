package com.shine.framework.DB4o.example;

import java.util.List;

import com.shine.framework.DB4o.util.DB4oMap;

public class DB4oMapExample {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		DB4oMap map = new DB4oMap("map.data");
		map.put("a", "123");
		List<Object> list = map.get("a");
		System.out.println(String.valueOf(list.get(0)));
	}

}
