package com.shine.sourceflow.dao.show;

import java.text.DecimalFormat;
import java.util.Map;

import com.shine.DBUtil.model.DBModel;
import com.shine.DBUtil.model.DBRowModel;
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
		DBModel retModel = new DBModel();
		// 计算源协议总流量
		for (int i = 0; i < srcDBModel.size(); i++) {
			double srcProtocolTotal = 0;
			srcProtocolTotal = Double.parseDouble(srcDBModel.get(i).get("total_bytes"));
			String srcProtocolTotalFormat = bytesFormat.format(srcProtocolTotal / 1048576);
			Double computeSrcProtocolPer = (srcProtocolTotal / bytesSum) * 100;
			String srcProtocolPercentage = perFormat.format(computeSrcProtocolPer);
			DBRowModel dbRowModel = new DBRowModel();
			dbRowModel.put("dst_protocol_total", "0");
			dbRowModel.put("dst_protocol_percentage", "0");
			dbRowModel.put("src_protocol_total", srcProtocolTotalFormat);
			dbRowModel.put("src_protocol_percentage", srcProtocolPercentage);
			dbRowModel.put("protocol_id", srcDBModel.get(i).get("protocol_id"));
			dbRowModel.put("protocol_alias", srcDBModel.get(i).get("protocol_alias"));
			retModel.add(dbRowModel);
		}
		// 计算目标协议总流量
		for (int i = 0; i < dstDBModel.size(); i++) {
			double dstProtocolTotal = Double.parseDouble(dstDBModel.get(i).get("total_bytes"));
			String dstProtocolTotalFormat = bytesFormat.format(dstProtocolTotal / 1048576);
			double computeDstProtocolPer = (dstProtocolTotal / bytesSum) * 100;
			String dstProtocolPercentage = perFormat.format(computeDstProtocolPer);
			DBRowModel dbRowModel = new DBRowModel();
			DBRowModel theModel = this.getSameModel(dstDBModel.get(i).get("protocol_id"), retModel);
			if (theModel != null) {
				dbRowModel = theModel;
			} else {
				dbRowModel.put("src_protocol_total", "0");
				dbRowModel.put("src_protocol_percentage", "0");
				dbRowModel.put("protocol_id", dstDBModel.get(i).get("protocol_id"));
				dbRowModel.put("protocol_alias", dstDBModel.get(i).get("protocol_alias"));
			}
			dbRowModel.put("dst_protocol_total", dstProtocolTotalFormat);
			dbRowModel.put("dst_protocol_percentage", dstProtocolPercentage);
			retModel.add(dbRowModel);
		}
		dbModels.put(GenericAction.DATA_DEFAULT, retModel);
	}
	
	private DBRowModel getSameModel(String modelId, DBModel retModel) {
		for (int i = 0; i < retModel.size(); i++) {
			String protocolId = retModel.get(i).get("protocol_id");
			if (modelId.equals(protocolId)) {
				return retModel.get(i);
			}
		}
		return null;
	}
}
