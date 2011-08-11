package com.shine.Netflow.translator;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.shine.Netflow.model.RawNetFlow;
import com.shine.Netflow.utils.NetFlowUtil;

public class TranslatorHelper {
	private static TranslatorHelper helper;
	private static Map<Integer, Translator> map = new HashMap<Integer, Translator>();
	private static boolean b = true;

	public static TranslatorHelper getHelper() {
		if (b) {
			helper = new TranslatorHelper();
			map.put(5, new TranslatorV5());
			b = false;
		}
		return helper;
	}

	/**
	 * 解析数据包
	 * 
	 * @param rid
	 * @param data
	 */
	public RawNetFlow translator(int rid, byte[] data) {
		return map.get(5).translate(rid, data);
	}
}
