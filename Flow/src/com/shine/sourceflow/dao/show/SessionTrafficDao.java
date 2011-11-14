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
		DBModel retModel = srcDBModel;
		if (srcDBModel.size() < dstDBModel.size()) {
			retModel = dstDBModel;
		}
		int size = srcDBModel.size() > dstDBModel.size() ? srcDBModel.size() : dstDBModel.size();
		for (int i = 0; i < size; i++) {
			// 计算源端口协议总流量
			double srcSessionTotal = 0;
			if (srcDBModel.size() > i) {
				srcSessionTotal = Double.parseDouble(srcDBModel.get(i).get("total_bytes"));
			}
			String srcSessionTotalFormat = bytesFormat.format(srcSessionTotal / 1048576);
			Double computeSrcSessionPer = (srcSessionTotal / bytesSum) * 100;
			String srcSessionPercentage = perFormat.format(computeSrcSessionPer);
			retModel.get(i).put("src_session_total", srcSessionTotalFormat);
			retModel.get(i).put("src_session_percentage", srcSessionPercentage);
			
			// 计算目标端口协议总流量
			double dstSessionTotal = 0;
			if (dstDBModel.size() > i) {
				dstSessionTotal = Double.parseDouble(dstDBModel.get(i).get("total_bytes"));
			}
			String dstSessionTotalFormat = bytesFormat.format(dstSessionTotal / 1048576);
			double computeDstSessionPer = (srcSessionTotal / bytesSum) * 100;
			String dstSessionPercentage = perFormat.format(computeDstSessionPer);
			retModel.get(i).put("dst_session_total", dstSessionTotalFormat);
			retModel.get(i).put("dst_session_percentage", dstSessionPercentage);
			retModel.get(i).put("session_total", bytesFormat.format((srcSessionTotal + dstSessionTotal) / 1048576));
		}
		dbModels.put(GenericAction.DATA_DEFAULT, retModel);
	}
}
