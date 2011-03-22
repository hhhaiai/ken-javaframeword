package com.shine.framework.EmailUtil;


public class Example {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		MailUtil.sendSimpleMail("http://smtp.163.com", "54", "arjick@163.com",
				"arjick", "password", "arjick@163.com", "arjick", "test",
				"test");
		
//		EmailTransmitter et = new EmailTransmitter("smtp.gmail.com", "softjiang", "password", "测试", "softjiang@gmail.com");
//		et.send("标题", "内容", new String[]{"kpengjay@qq.com","jkp@yangguangnet.com"}, new String[]{"G:/短信.java","G:/note.txt"});
	}
}
