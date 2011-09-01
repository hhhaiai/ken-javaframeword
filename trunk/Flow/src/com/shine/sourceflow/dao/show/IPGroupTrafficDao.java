package com.shine.sourceflow.dao.show;

import java.sql.SQLException;
import java.text.DecimalFormat;
import java.util.HashMap;
import java.util.Map;

import com.shine.DBUtil.DBUtil;
import com.shine.DBUtil.model.DBModel;
import com.shine.sourceflow.dao.GenericDao;
import com.shine.sourceflow.dao.show.strategy.IPGroupTrafficQueryStrategy;
import com.shine.sourceflow.model.GenericDto;
import com.shine.sourceflow.model.show.ShowGenericDto;
import com.shine.sourceflow.web.GenericAction;

public class IPGroupTrafficDao extends ShowGenericDao {
	public IPGroupTrafficDao() {
		this.queryStrategy = new IPGroupTrafficQueryStrategy();
	}
	
	@Override
	public Map<String, DBModel> list(GenericDto dto) {
		Map<String, DBModel> dbModels = new HashMap<String, DBModel>();
		String[] sql = this.createQuerySQL((ShowGenericDto)dto);
		String[] sum = this.createQuerySumSQL((ShowGenericDto)dto);
		if (sql.length > 1 && sql[0] != null && sql[1] != null) {
			// 查询流出数据
			DBModel dbModelSrcip =
				DBUtil.getInstance().executeQuery(GenericDao.JNDI_MONETDB, sql[0]);
			DBModel dbModelSrcipSum =
				DBUtil.getInstance().executeQuery(GenericDao.JNDI_MONETDB, sum[0]);
			try {
				dbModelSrcip.next();
				dbModelSrcipSum.next();
			} catch (SQLException e) {
				e.printStackTrace();
			} finally {
				dbModelSrcip.close();
				dbModelSrcipSum.close();
			}
			// 查询流入数据
			DBModel dbModelDstip = 
				DBUtil.getInstance().executeQuery(GenericDao.JNDI_MONETDB, sql[1]);
			DBModel dbModelDstipSum =
				DBUtil.getInstance().executeQuery(GenericDao.JNDI_MONETDB, sum[1]);
			try {
				dbModelDstip.next();
				dbModelDstipSum.next();
			} catch (SQLException e) {
				e.printStackTrace();
			} finally {
				dbModelDstip.close();
				dbModelDstipSum.close();
			}
			// 将流入数据和流出数据整合
			DecimalFormat perFormat = new DecimalFormat("0.00");
			DecimalFormat bytesTotalFormat = new DecimalFormat("0");
			if (dbModelSrcip.size() > 0) {
				double srcipBytesSum = Double.parseDouble(dbModelSrcipSum.get(0).get("bytes_sum"));
				double dstipBytesSum = Double.parseDouble(dbModelDstipSum.get(0).get("bytes_sum"));
				for (int i = 0; i < dbModelSrcip.size(); i++) {
					// 计算源IP总流量
					Double srcIpTotal = Double.parseDouble(dbModelSrcip.get(i).get("total_bytes"));
					Double computeSrcIpTotal = srcIpTotal / 1048576;
					String srcIpTotalFormat = bytesTotalFormat.format(computeSrcIpTotal);
					// 计算源IP流量百分比
					Double computeSrcIpPer = (srcIpTotal / srcipBytesSum) * 100;
					String srcIpPercentage = perFormat.format(computeSrcIpPer);
					dbModelSrcip.get(i).put("src_ip_total", srcIpTotalFormat);
					dbModelSrcip.get(i).put("src_ip_percentage", srcIpPercentage);
					
					// 计算目标IP总流量
					Double dstIpTotal = Double.parseDouble(dbModelDstip.get(i).get("total_bytes"));
					Double computeDstIpTotal = dstIpTotal / 1048576;
					String dstIpTotalFormat = bytesTotalFormat.format(computeDstIpTotal);
					// 计算目标IP流量百分比
					Double computeDstIpPer = (srcIpTotal / dstipBytesSum) * 100;
					String dstIpPercentage = perFormat.format(computeDstIpPer);
					dbModelSrcip.get(i).put("dst_ip_total", dstIpTotalFormat);
					dbModelSrcip.get(i).put("dst_ip_percentage", dstIpPercentage);
				}
			}
			dbModels.put(GenericAction.DATA_DEFAULT, dbModelSrcip);
		}
		return dbModels;
	}
}
