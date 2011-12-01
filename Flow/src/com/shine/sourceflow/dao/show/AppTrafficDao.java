package com.shine.sourceflow.dao.show;

import java.text.DecimalFormat;
import java.util.Map;

import com.shine.DBUtil.model.DBModel;
import com.shine.DBUtil.model.DBRowModel;
import com.shine.sourceflow.dao.show.strategy.AppTrafficStdQueryStrategy;
import com.shine.sourceflow.web.GenericAction;

public class AppTrafficDao extends ShowGenericDao {
	public AppTrafficDao() {
		this.queryStrategy = new AppTrafficStdQueryStrategy();
	}
	
	@Override
	public void handleModel(Map<String, DBModel> dbModels, DBModel dbModelTrafficIn,
			DBModel dbModelTrafficOut, DecimalFormat perFormat,
			DecimalFormat bytesFormat, double bytesSum) {
		DBModel retModel = new DBModel();
		// 计算流入流量
		for (int i = 0; i < dbModelTrafficIn.size(); i++) {
			double totalBytesIn = Double.parseDouble(dbModelTrafficOut.get(i).get("bytes_total"));
			String totalBytesInFormat = bytesFormat.format(totalBytesIn / 1048576);
			String bytesInPercentage = perFormat.format((totalBytesIn / bytesSum) * 100);
			DBRowModel dbRowModel = new DBRowModel();
			dbRowModel.put("total_bytes_out", "0");
			dbRowModel.put("bytes_out_percentage", "0");
			dbRowModel.put("total_bytes_in", totalBytesInFormat);
			dbRowModel.put("bytes_in_percentage", bytesInPercentage);
			dbRowModel.put("app_id", dbModelTrafficIn.get(i).get("app_id"));
			dbRowModel.put("app_alias", dbModelTrafficIn.get(i).get("app_alias"));
			dbRowModel.put("ip_address", dbModelTrafficIn.get(i).get("ip_address"));
			retModel.add(dbRowModel);
		}
		// 计算流出流量
		for (int i = 0; i < dbModelTrafficOut.size(); i++) {
			double totalBytesOut = Double.parseDouble(dbModelTrafficOut.get(i).get("bytes_total"));
			String totalBytesOutFormat = bytesFormat.format(totalBytesOut / 1048576);
			String bytesOutPercentage = perFormat.format((totalBytesOut / bytesSum) * 100);
			DBRowModel dbRowModel = new DBRowModel();
			DBRowModel theModel = this.getSameModel(dbModelTrafficOut.get(i).get("app_id"), retModel);
			if (theModel != null) {
				dbRowModel = theModel;
			} else {
				dbRowModel.put("total_bytes_in", "0");
				dbRowModel.put("bytes_in_percentage", "0");
				dbRowModel.put("app_id", dbModelTrafficOut.get(i).get("app_id"));
				dbRowModel.put("app_alias", dbModelTrafficOut.get(i).get("app_alias"));
				dbRowModel.put("ip_address", dbModelTrafficOut.get(i).get("ip_address"));
			}
			dbRowModel.put("total_bytes_out", totalBytesOutFormat);
			dbRowModel.put("bytes_out_percentage", bytesOutPercentage);
			retModel.add(dbRowModel);
		}
		dbModels.put(GenericAction.DATA_DEFAULT, retModel);
	}
	
	private DBRowModel getSameModel(String modelId, DBModel retModel) {
		for (int i = 0; i < retModel.size(); i++) {
			String appId = retModel.get(i).get("app_id");
			if (modelId.equals(appId)) {
				return retModel.get(i);
			}
		}
		return null;
	}
}
