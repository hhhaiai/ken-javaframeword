package com.shine.framework.EmailUtil;

public class Example {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		MailUtil.sendSimpleMail("http://smtp.163.com", "54", "arjick@163.com",
				"arjick", "password", "arjick@163.com", "arjick", "test",
				"test");
	}
}
