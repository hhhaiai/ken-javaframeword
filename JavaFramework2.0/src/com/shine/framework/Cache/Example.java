package com.shine.framework.Cache;

public class Example {
	public static void main(String args[]) {
		CacheManager.getManager().addCache("123", "t", "a");

		System.out.println(CacheManager.getManager().getCache("t", "a"));
	}
}
