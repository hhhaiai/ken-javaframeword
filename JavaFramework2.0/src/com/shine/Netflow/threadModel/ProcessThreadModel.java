package com.shine.Netflow.threadModel;

import java.util.ArrayList;
import java.util.List;

import com.shine.Netflow.model.RawNetFlow;
import com.shine.Netflow.model.SourceNetFlow;
import com.shine.Netflow.translator.TranslatorHelper;
import com.shine.framework.ThreadPoolUtil.model.ThreadModel;

public class ProcessThreadModel extends ThreadModel {

	private List<SourceNetFlow> flows;

	/**
	 * 处理器
	 */
	@Override
	public void excute(Object... args) {
		try {
			if (args.length != 0) {
				flows = (ArrayList<SourceNetFlow>) args[0];

				for (SourceNetFlow flow : flows) {
					TranslatorHelper.translator(flow.getRouteId(), flow
							.getNetflowData());
				}
				flows = null;
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

}
