package com.shine.sourceflow.dao.show;

import java.text.DecimalFormat;
import java.util.Map;

import com.shine.DBUtil.model.DBModel;
import com.shine.sourceflow.dao.show.strategy.IPTrafficStdQueryStrategy;
import com.shine.sourceflow.web.show.IPTrafficAction;

/**
 * IP流量
 */
public class IPTrafficDao extends ShowGenericDao {
	public IPTrafficDao() {
		this.queryStrategy = new IPTrafficStdQueryStrategy();
	}
	
	@Override
	public void handleModel(Map<String, DBModel> dbModels, DBModel srcDBModel,
			DBModel dstDBModel, DecimalFormat perFormat,
			DecimalFormat bytesFormat, double bytesSum) {
		// 对源IP查询数据进行计算统计
		for (int i = 0; i < srcDBModel.size(); i++) {
			double bytesTotal = Double.parseDouble(srcDBModel.get(i).get("total_bytes"));
			Double computePer = (bytesTotal / bytesSum) * 100;
			String percentage = perFormat.format(computePer);
			srcDBModel.get(i).put("percentage", percentage);
			String formatBytesTotal = bytesFormat.format(bytesTotal / 1048576);
			srcDBModel.get(i).put("format_bytes_total", formatBytesTotal);
		}
		// 对目标IP查询数据进行计算统计
		for (int i = 0; i < dstDBModel.size(); i++) {
			double bytesTotal = Double.parseDouble(dstDBModel.get(i).get("total_bytes"));
			Double computePer = (bytesTotal / bytesSum) * 100;
			String percentage = perFormat.format(computePer);
			dstDBModel.get(i).put("percentage", percentage);
			String formatBytesTotal = bytesFormat.format(bytesTotal / 1048576);
			dstDBModel.get(i).put("format_bytes_total", formatBytesTotal);
		}
		dbModels.put(IPTrafficAction.IP_SRC, srcDBModel);
		dbModels.put(IPTrafficAction.IP_DST, dstDBModel);
	}
}
