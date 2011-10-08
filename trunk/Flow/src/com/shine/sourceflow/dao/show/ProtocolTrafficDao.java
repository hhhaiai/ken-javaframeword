package com.shine.sourceflow.dao.show;

import java.text.DecimalFormat;
import java.util.Map;

import com.shine.DBUtil.model.DBModel;
import com.shine.sourceflow.dao.show.strategy.ProtocolTrafficStdQuery;
import com.shine.sourceflow.web.GenericAction;

/**
 * 协议流量
 */
public class ProtocolTrafficDao extends ShowGenericDao {
	public ProtocolTrafficDao() {
		this.queryStrategy = new ProtocolTrafficStdQuery();
	}
	
	@Override
	public void handleModel(Map<String, DBModel> dbModels, DBModel srcDBModel,
			DBModel dstDBModel, DecimalFormat perFormat,
			DecimalFormat bytesFormat, double bytesSum) {
		for (int i = 0; i < srcDBModel.size(); i++) {
			// 计算源端口协议总流量
			Double srcProtocolTotal = Double.parseDouble(srcDBModel.get(i).get("total_bytes"));
			String srcProtocolTotalFormat = bytesFormat.format(srcProtocolTotal / 1048576);
			Double computeSrcProtocolPer = (srcProtocolTotal / bytesSum) * 100;
			String srcProtocolPercentage = perFormat.format(computeSrcProtocolPer);
			srcDBModel.get(i).put("src_protocol_total", srcProtocolTotalFormat);
			srcDBModel.get(i).put("src_protocol_percentage", srcProtocolPercentage);
			
			// 计算目标端口协议总流量
			String dstProtocolTotalFormat = "0";
			String dstProtocolPercentage = "0";
			if (dstDBModel.size() > i) {
				double dstProtocolTotal = Double.parseDouble(dstDBModel.get(i).get("total_bytes"));
				dstProtocolTotalFormat = bytesFormat.format(dstProtocolTotal / 1048576);
				double computeDstProtocolPer = (srcProtocolTotal / bytesSum) * 100;
				dstProtocolPercentage = perFormat.format(computeDstProtocolPer);
			}
			srcDBModel.get(i).put("dst_protocol_total", dstProtocolTotalFormat);
			srcDBModel.get(i).put("dst_protocol_percentage", dstProtocolPercentage);
		}
		dbModels.put(GenericAction.DATA_DEFAULT, srcDBModel);
	}
}
