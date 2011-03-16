package com.shine.framework.SnmpUtil;

import java.util.List;

public class Example {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		SnmpUtil util = null;
		try {
			String[] oid = { "1.3.6.1.2.1.25.2.3.1.2", // type
					"1.3.6.1.2.1.25.2.3.1.3", // descr
					"1.3.6.1.2.1.25.2.3.1.4", // unit
					"1.3.6.1.2.1.25.2.3.1.5", // size
					"1.3.6.1.2.1.25.2.3.1.6" }; // used
			util = new SnmpUtil("10.42.8.15", "public", 161);
			List<String> list = util.getTableView(oid);
			for (String s : list) {
				System.out.println(s);
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			util.close();
		}
	}

}
