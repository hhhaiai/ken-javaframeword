package com.shine.sourceflow.dao.show;

import java.text.DecimalFormat;
import java.util.Map;

import com.shine.DBUtil.model.DBModel;
import com.shine.DBUtil.model.DBRowModel;
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
		DBModel retModel = new DBModel();
		// 计算源IP总流量
		for (int i = 0; i < srcDBModel.size(); i++) {
			double srcIpTotal = Double.parseDouble(srcDBModel.get(i).get("total_bytes"));
			String srcIpTotalFormat = bytesFormat.format(srcIpTotal / 1048576);
			double computeSrcIpPer = (srcIpTotal / bytesSum) * 100;
			String srcIpPercentage = perFormat.format(computeSrcIpPer);
			DBRowModel dbRowModel = new DBRowModel();
			dbRowModel.put("dst_ip_total", "0");
			dbRowModel.put("dst_ip_percentage", "0");
			dbRowModel.put("src_ip_total", srcIpTotalFormat);
			dbRowModel.put("src_ip_percentage", srcIpPercentage);
			dbRowModel.put("group_id", srcDBModel.get(i).get("group_id"));
			dbRowModel.put("ip_alias", srcDBModel.get(i).get("ip_alias"));
			retModel.add(dbRowModel);
		}
		// 计算目标IP总流量
		for (int i = 0; i < dstDBModel.size(); i++) {
			double dstIpTotal = Double.parseDouble(dstDBModel.get(i).get("total_bytes"));
			String dstIpTotalFormat = bytesFormat.format(dstIpTotal / 1048576);
			double computeDstIpPer = (dstIpTotal / bytesSum) * 100;
			String dstIpPercentage = perFormat.format(computeDstIpPer);
			DBRowModel theModel = this.getSameModel(dstDBModel.get(i).get("group_id"), retModel);
			if (theModel != null) {
				theModel.put("dst_ip_total", dstIpTotalFormat);
				theModel.put("dst_ip_percentage", dstIpPercentage);
			} else {
				DBRowModel dbRowModel = new DBRowModel();
				dbRowModel.put("src_ip_total", "0");
				dbRowModel.put("src_ip_percentage", "0");
				dbRowModel.put("dst_ip_total", dstIpTotalFormat);
				dbRowModel.put("dst_ip_percentage", dstIpPercentage);
				dbRowModel.put("group_id", dstDBModel.get(i).get("group_id"));
				dbRowModel.put("ip_alias", dstDBModel.get(i).get("ip_alias"));
				retModel.add(dbRowModel);
			}
		}
		dbModels.put(GenericAction.DATA_DEFAULT, retModel);
	}
	
	private DBRowModel getSameModel(String modelId, DBModel retModel) {
		for (int i = 0; i < retModel.size(); i++) {
			String groupId = retModel.get(i).get("group_id");
			if (modelId.equals(groupId)) {
				return retModel.get(i);
			}
		}
		return null;
	}
}
