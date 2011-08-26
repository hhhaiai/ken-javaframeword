package com.shine.netflow.handle;

import java.util.List;

import com.shine.DBUtil.DBUtil;
import com.shine.Netflow.model.RawNetFlow;
import com.shine.Netflow.netflowIf.NetFlowIf;
import com.shine.framework.utils.TableUtil;

public class NetflowImpl implements NetFlowIf {
	public void handle(List<RawNetFlow> list) {
		for (RawNetFlow flow : list) {
			DBUtil.getInstance().addBatchUpdate("jdbc/flow",
					flow.toSQL(TableUtil.getCurrentMonthTable()));
			DBUtil.getInstance().addBatchUpdate("jdbc/MonetDB",
					flow.toSQL(TableUtil.getCurrentMonthTable()));
		}
	}
}
