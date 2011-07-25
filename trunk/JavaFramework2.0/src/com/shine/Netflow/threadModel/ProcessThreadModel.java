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
	}

	/**
	 * 处理器
	 */
	@Override
	public void excute(Object... args) {
		
		try {
			if (args.length != 0) {
				System.out.println(this.getThreadName()+" busying");
				flows = (ArrayList<SourceNetFlow>) args[0];
				// 清空
				flowResults.clear();
				System.out.println("大小："+flows.size());

				for (SourceNetFlow flow : flows) {
					flowResults.add(TranslatorHelper.getHelper().translator(
							flow.getRouteId(), flow.getNetflowData()));
				}
				flows = null;

				// 获取处理器
				for (NetFlowIf netflowIf : NetflowManager.getManager()
						.getNetflowHandleMap().values()) {
					netflowIf.handle(flowResults);
				}
				flowResults.clear();
				System.out.println(this.getThreadName()+" idleing");
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
