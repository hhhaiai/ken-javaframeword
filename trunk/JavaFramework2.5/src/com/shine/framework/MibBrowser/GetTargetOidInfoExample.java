package com.shine.framework.MibBrowser;

import com.shine.framework.MibBrowser.model.MibModel;

public class GetTargetOidInfoExample {

	/**
	 * 获取指定oid的信息
	 * 
	 * @param args
	 */
	public static void main(String[] args) {
		MibModel model = MibBrowserUtils
				.getOidInfo(
						"E:/workspace/nms4.6/WebContent/WEB-INF/config/mib/CISCO-PRODUCTS-MIB.mib",
						"1.3.6.1.4.1.9.1.67");
		System.out.println(model.getName());
	}

}
