package com.shine.framework.MibBrowser;

import java.util.List;

import com.shine.framework.MibBrowser.model.MibModel;

public class Example {
	public static void main(String[] args) {
		OidInfoExample();
	}

	public static void printlnMibModel(MibModel mibModel) {
		if (mibModel == null)
			return;
		System.out.println(mibModel.getName());
		System.out.println(mibModel.getDetail());
		System.out.println(mibModel.getOid());
	}

	public static void OidInfoExample() {
		System.out.println("===getOidInfo方法===");
		MibModel mibModel = MibBrowserUtils
				.getOidInfo(
						"E:/workspace/nms4.6/WebContent/WEB-INF/config/mib/CISCO-PRODUCTS-MIB.mib",
						"1.3.6.1.4.1.9.1.693");
		printlnMibModel(mibModel);
		MibModel mibModel1 = MibBrowserUtils.getOidInfo(MibBrowserUtils
				.getAllOid("mib地址"), "1.3.6.1.4.1.9.1.693");

	}

	public static void AllOidExample() {
		System.out.println("===getAllOid方法===");
		List<MibModel> list = MibBrowserUtils.getAllOid("mib地址");
		if (list == null)
			return;
		for (MibModel mibModel : list) {
			printlnMibModel(mibModel);
		}
	}
}
