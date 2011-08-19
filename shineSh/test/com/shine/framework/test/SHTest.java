package com.shine.framework.test;

import java.util.List;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.shine.framework.dao.GenericDao;
import com.shine.framework.test.entity.TestUser;

public class SHTest {

	/**
	 * SH查询测试
	 * 请配置好jdbc.properties
	 */
	public static void main(String[] args) {
		GenericDao dao = null;
		ApplicationContext context = new ClassPathXmlApplicationContext("com/shine/framework/test/applicationContext.xml");
		dao = (GenericDao)context.getBean("genericDao");
		List<TestUser> list = dao.find("from TestUser u");
		System.out.println("MySQL有以下用户：");
		for (TestUser user : list) {
			System.out.println("host:"+user.getHost()+"\tname:"+user.getName());
		}
	}

}
