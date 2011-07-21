package com.shine.Netflow.threadModel;

import java.util.ArrayList;
import java.util.List;

import com.shine.Netflow.model.RawNetFlow;
import com.shine.Netflow.translator.TranslatorHelper;
import com.shine.framework.ThreadPoolUtil.model.ThreadModel;

public class ProcessThreadModel extends ThreadModel {

	private List<byte[]> flows;

	/**
	 * 处理器
	 */
	@Override
	public void excute(Object... args) {
		try {
			if (args.length != 0) {
				flows = (ArrayList<byte[]>) args[0];

				for (byte[] data : flows) {
					TranslatorHelper.translator(1, data);
				}
				flows = null;
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

}
