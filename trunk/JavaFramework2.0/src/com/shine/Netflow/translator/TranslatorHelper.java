package com.shine.Netflow.translator;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.shine.Netflow.model.RawNetFlow;
import com.shine.Netflow.utils.NetFlowUtil;

public class TranslatorHelper {
	private static Map<Integer, Translator> map = new HashMap<Integer, Translator>();

	public TranslatorHelper() {
		super();

		map.put(5, new TranslatorV5());
	}

	/**
	 * 获取数据包的版本
	 * 
	 * @param buffer
	 * @return
	 */
	public static int getFlowVersion(byte[] buffer) {
		return NetFlowUtil.toIntNumber(buffer, 0, 2);
	}

	/**
	 * 解析数据包
	 * 
	 * @param rid
	 * @param data
	 */
	public static void translator(int rid, byte[] data) {
		RawNetFlow flow = map.get(getFlowVersion(data)).translate(rid, data);
		System.out.println(flow.toString());
	}
}
