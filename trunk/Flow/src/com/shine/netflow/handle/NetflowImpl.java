package com.shine.netflow.handle;

import java.util.List;

import com.shine.Netflow.model.RawNetFlow;
import com.shine.Netflow.netflowIf.NetFlowIf;
import com.shine.framework.DBUtil.DBUtil;
import com.shine.netflow.utils.NetflowHelper;

public class NetflowImpl implements NetFlowIf {

	public void handle(List<RawNetFlow> list) {
		for (RawNetFlow flow : list) {
			DBUtil.getInstance().addBatchUpdate("jdbc/flow",
					flow.toSQL(NetflowHelper.getHelper().getHourTableName()));
		}

	}

}
