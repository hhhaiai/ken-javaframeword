package com.shine.framework.Cache.Example;

import com.shine.framework.Cache.CacheManager;

public class Example {
	public static void main(String args[]) {
		CacheManager.getManager().addCache("123", "t", "a");

		System.out.println(CacheManager.getManager().getCache("t", "a"));
	}
}
