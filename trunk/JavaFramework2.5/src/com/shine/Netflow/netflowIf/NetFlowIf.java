package com.shine.Netflow.netflowIf;

import java.util.List;

import com.shine.Netflow.model.RawNetFlow;

public interface NetFlowIf {
	public void handle(List<RawNetFlow> list);
}
