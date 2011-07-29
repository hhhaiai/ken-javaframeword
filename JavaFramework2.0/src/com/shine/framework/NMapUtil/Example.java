package com.shine.framework.NMapUtil;

import org.dom4j.DocumentException;

public class Example {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		// TODO Auto-generated method stub
		try {
			new NMapHelper()
					.executeXmlFile("E:\\workspace\\JavaFramework2.0\\src\\com\\shine\\framework\\NMapUtil\\config\\test.xml");
		} catch (DocumentException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

}
