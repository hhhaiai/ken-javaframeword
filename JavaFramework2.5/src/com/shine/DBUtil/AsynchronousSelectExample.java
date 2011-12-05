package com.shine.DBUtil;

import com.shine.DBUtil.model.DBModel;

public class AsynchronousSelectExample {
	private String uu = "213";

	public void getReusltModel(DBModel dbModel) {
		System.err.println(uu + dbModel.getDataXml());
		dbModel.close();
	}

	public void test() {
		this.setUu("aaaaaaaa");
		DBUtil
				.getInstance()
				.init(
						"C:\\Users\\yangyang\\workspace\\JavaFramework2.5\\src\\com\\shine\\DBUtil\\config\\dbXml.xml");
		DBUtil.getInstance().asynchronousExecuteQuery("jdbc/Default",
				"select * from admin_dept", this, "getReusltModel",
				true);
	}

	/**
	 * 异步查找例子
	 * 
	 * @param args
	 */
	public static void main(String[] args) {

		AsynchronousSelectExample example = new AsynchronousSelectExample();
		example.test();
	}

	public String getUu() {
		return uu;
	}

	public void setUu(String uu) {
		this.uu = uu;
	}

}
