package com.shine.sourceflow.dao.show;

import java.text.DecimalFormat;
import java.util.Map;

import com.shine.DBUtil.model.DBModel;
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
		for (int i = 0; i < dbModelTrafficIn.size(); i++) {
			// 流入流量
			double totalBytesIn = Double.parseDouble(dbModelTrafficIn.get(i).get("bytes_total"));
			String totalBytesInFormat = bytesFormat.format(totalBytesIn / 1048576);
			String bytesInPercentage = perFormat.format((totalBytesIn / bytesSum) * 100);
			dbModelTrafficIn.get(i).put("total_bytes_in", totalBytesInFormat);
			dbModelTrafficIn.get(i).put("bytes_in_percentage", bytesInPercentage);
			// 流出流量
			double totalBytesOut = 0;
			if (dbModelTrafficOut.size() > i) {
				totalBytesOut = Double.parseDouble(dbModelTrafficOut.get(i).get("bytes_total"));
			}
			String totalBytesOutFormat = bytesFormat.format(totalBytesOut / 1048576);
			String bytesOutPercentage = perFormat.format((totalBytesOut / bytesSum) * 100);
			dbModelTrafficIn.get(i).put("total_bytes_out", totalBytesOutFormat);
			dbModelTrafficIn.get(i).put("bytes_out_percentage", bytesOutPercentage);
			// 总流量
			String totalBytesAllFormat = bytesFormat.format((totalBytesIn + totalBytesOut) / 1048576);
			dbModelTrafficIn.get(i).put("total_bytes_all", totalBytesAllFormat);
		}
		dbModels.put(GenericAction.DATA_DEFAULT, dbModelTrafficIn);
	}
}
