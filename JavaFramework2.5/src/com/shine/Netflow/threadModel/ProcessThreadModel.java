package com.shine.Netflow.threadModel;

import java.util.ArrayList;
import java.util.List;

import com.shine.Netflow.NetflowManager;
import com.shine.Netflow.model.RawNetFlow;
import com.shine.Netflow.model.SourceNetFlow;
import com.shine.Netflow.netflowIf.NetFlowIf;
import com.shine.Netflow.translator.TranslatorHelper;
import com.shine.framework.ThreadPoolUtil.model.ThreadModel;

public class ProcessThreadModel extends ThreadModel {

	private List<SourceNetFlow> flows;
	private List<RawNetFlow> flowResults;

	public ProcessThreadModel() {
		flowResults = new ArrayList<RawNetFlow>();

		this.setType("process");
	}

	/**
	 * 处理器
	 */
	@Override
	public void excute(Object... args) {

		try {
			if (args.length != 0) {
				flows = (ArrayList<SourceNetFlow>) args[0];
				// 清空
				flowResults.clear();

				for (SourceNetFlow flow : flows) {
					flowResults.add(TranslatorHelper.getHelper().translator(
							flow.getRouteId(), flow.getNetflowData()));
				}
				flows = null;

				// 获取处理器
				for (NetFlowIf netflowIf : NetflowManager.getManager()
						.getNetflowHandleMap().values()) {
					netflowIf.handle((List) ((ArrayList) flowResults).clone());
				}
				flowResults.clear();
				args = null;
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
