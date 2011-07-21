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
		RawNetFlow flow = t.translate(rid, data);
		System.out.println(flow.toString());
	}
}
