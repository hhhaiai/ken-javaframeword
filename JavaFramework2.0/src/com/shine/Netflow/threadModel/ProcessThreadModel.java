package com.shine.Netflow.threadModel;

import java.util.List;

import com.shine.Netflow.model.RawNetFlow;
import com.shine.framework.ThreadPoolUtil.model.ThreadModel;

public class ProcessThreadModel extends ThreadModel {

	private List<RawNetFlow> flows;

	@Override
	public void excute() {
		try {
			for (RawNetFlow flow : flows) {

			}
			flows = null;
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

}
