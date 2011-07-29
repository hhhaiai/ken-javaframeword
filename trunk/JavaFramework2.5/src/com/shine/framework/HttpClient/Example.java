package com.shine.framework.HttpClient;

public class Example {
	public static void main(String args[]) {
		System.out.println(HttpClientUtil.getMethodDataResult(HttpClientUtil
				.getHttpClient(), "http://www.hao123.com"));
	}
}
