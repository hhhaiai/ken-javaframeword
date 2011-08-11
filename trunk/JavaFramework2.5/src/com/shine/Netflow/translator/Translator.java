package com.shine.Netflow.translator;

import java.util.List;

import com.shine.Netflow.model.RawNetFlow;
import com.shine.Netflow.utils.NetFlowUtil;

public abstract class Translator {
	


	abstract RawNetFlow translate(final int rid, final byte[] buffer);
}
