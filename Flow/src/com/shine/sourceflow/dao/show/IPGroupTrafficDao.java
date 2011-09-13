package com.shine.sourceflow.dao.show;

import java.text.DecimalFormat;
import java.util.Map;

import com.shine.DBUtil.model.DBModel;
import com.shine.sourceflow.dao.show.strategy.IPGroupTrafficStdQueryStrategy;
import com.shine.sourceflow.web.GenericAction;

public class IPGroupTrafficDao extends ShowGenericDao {
	public IPGroupTrafficDao() {
		this.queryStrategy = new IPGroupTrafficStdQueryStrategy();
	}
	
	@Override
	public void handleModel(Map<String, DBModel> dbModels, DBModel srcDBModel,
			DBModel dstDBModel, DecimalFormat perFormat,
			DecimalFormat bytesFormat, double bytesSum) {
		for (int i = 0; i < srcDBModel.size(); i++) {
			// 计算源IP总流量
			Double srcIpTotal = Double.parseDouble(srcDBModel.get(i).get("total_bytes"));
			String srcIpTotalFormat = bytesFormat.format(srcIpTotal / 1048576);
			Double computeSrcIpPer = (srcIpTotal / bytesSum) * 100;
			String srcIpPercentage = perFormat.format(computeSrcIpPer);
			srcDBModel.get(i).put("src_ip_total", srcIpTotalFormat);
			srcDBModel.get(i).put("src_ip_percentage", srcIpPercentage);
			
			// 计算目标IP总流量
			String dstIpTotalFormat = "0";
			String dstIpPercentage = "0";
			if (dstDBModel.size() > i) {
				double dstIpTotal = Double.parseDouble(dstDBModel.get(i).get("total_bytes"));
				dstIpTotalFormat = bytesFormat.format(dstIpTotal / 1048576);
				double computeDstIpPer = (srcIpTotal / bytesSum) * 100;
				dstIpPercentage = perFormat.format(computeDstIpPer);
			}
			srcDBModel.get(i).put("dst_ip_total", dstIpTotalFormat);
			srcDBModel.get(i).put("dst_ip_percentage", dstIpPercentage);
		}
		dbModels.put(GenericAction.DATA_DEFAULT, srcDBModel);
	}
}
