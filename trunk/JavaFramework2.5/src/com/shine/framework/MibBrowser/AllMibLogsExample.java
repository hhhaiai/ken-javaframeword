package com.shine.framework.MibBrowser;

import java.util.List;

import com.shine.framework.MibBrowser.model.MibModel;

public class AllMibLogsExample {

	/**
	 * 获取指定文档的所有oid信息
	 * 
	 * @param args
	 */
	public static void main(String[] args) {
		List<MibModel> list = MibBrowserUtils
				.getAllOid("E:/workspace/nms4.6/WebContent/WEB-INF/config/mib/CISCO-PRODUCTS-MIB.mib");

		for (MibModel model : list) {
			System.out.println("name:" + model.getName());
			System.err.println("detail:" + model.getDetail());
		}

	}

}
