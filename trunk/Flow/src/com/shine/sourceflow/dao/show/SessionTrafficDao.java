package com.shine.sourceflow.dao.show;

import java.text.DecimalFormat;
import java.util.Map;

import com.shine.DBUtil.model.DBModel;
import com.shine.sourceflow.dao.show.strategy.SessionTrafficStdQuery;
import com.shine.sourceflow.web.GenericAction;

/**
 * 会话流量
 */
public class SessionTrafficDao extends ShowGenericDao {
	public SessionTrafficDao() {
		this.queryStrategy = new SessionTrafficStdQuery();
	}
	
	@Override
	public void handleModel(Map<String, DBModel> dbModels, DBModel srcDBModel,
			DBModel dstDBModel, DecimalFormat perFormat,
			DecimalFormat bytesFormat, double bytesSum) {
		for (int i = 0; i < srcDBModel.size(); i++) {
			// 计算源端口协议总流量
			double srcSessionTotal = Double.parseDouble(srcDBModel.get(i).get("total_bytes"));
			String srcSessionTotalFormat = bytesFormat.format(srcSessionTotal / 1048576);
			Double computeSrcSessionPer = (srcSessionTotal / bytesSum) * 100;
			String srcSessionPercentage = perFormat.format(computeSrcSessionPer);
			srcDBModel.get(i).put("src_session_total", srcSessionTotalFormat);
			srcDBModel.get(i).put("src_session_percentage", srcSessionPercentage);
			
			// 计算目标端口协议总流量
			String dstSessionTotalFormat = "0";
			String dstSessionPercentage = "0";
			double dstSessionTotal = 0;
			if (dstDBModel.size() > i) {
				dstSessionTotal = Double.parseDouble(dstDBModel.get(i).get("total_bytes"));
				dstSessionTotalFormat = bytesFormat.format(dstSessionTotal / 1048576);
				double computeDstSessionPer = (srcSessionTotal / bytesSum) * 100;
				dstSessionPercentage = perFormat.format(computeDstSessionPer);
			}
			srcDBModel.get(i).put("dst_session_total", dstSessionTotalFormat);
			srcDBModel.get(i).put("dst_session_percentage", dstSessionPercentage);
			srcDBModel.get(i).put("session_total", bytesFormat.format((srcSessionTotal + dstSessionTotal) / 1048576));
		}
		dbModels.put(GenericAction.DATA_DEFAULT, srcDBModel);
	}
}
