package com.shine.Netflow.translator;

import java.util.HashMap;
import java.util.List;

import com.shine.Netflow.model.RawNetFlow;

public class TranslatorHelper extends HashMap {
	public TranslatorHelper() {
		super();

		this.put(5, new TranslatorV5());
	}

	public static void translator(int rid, byte[] data) {
		TranslatorV5 t = new TranslatorV5();
		List<RawNetFlow> list = t.translate(rid, data);
		System.out.println("222:" + list.size());
		for (RawNetFlow flow : list) {
			System.out.println(flow.toString());
		}
	}
}
