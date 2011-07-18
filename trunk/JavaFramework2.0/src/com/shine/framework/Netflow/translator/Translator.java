package com.shine.Netflow.translator;

import java.util.List;

import com.shine.Netflow.model.RawNetFlow;
import com.shine.Netflow.utils.NetFlowUtil;

public abstract class Translator {
	/**
	 * 获取数据包的版本
	 * @param buffer
	 * @return
	 */
	public int getFlowVersion(byte[] buffer) {
		return NetFlowUtil.toIntNumber(buffer, 0, 2);
	}

	abstract List<RawNetFlow> translate(final int rid, final byte[] buffer);
}
