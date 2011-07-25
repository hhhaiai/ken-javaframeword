package com.shine.Netflow.netflowIf;

import java.util.List;

import com.shine.Netflow.model.RawNetFlow;

public class NetFlowImpl implements NetFlowIf {

	@Override
	public void handle(List<RawNetFlow> list) {
	    System.out.println("=========================");
		for (RawNetFlow flow : list) {
			System.out.println("test:" + flow.toString());
		}
		System.out.println("=========================");
	}

}
