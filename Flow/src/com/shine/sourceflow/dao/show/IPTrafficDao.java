package com.shine.sourceflow.dao.show;

import java.sql.SQLException;
import java.text.DecimalFormat;
import java.util.HashMap;
import java.util.Map;

import com.shine.DBUtil.DBUtil;
import com.shine.DBUtil.model.DBModel;
import com.shine.sourceflow.dao.GenericDao;
import com.shine.sourceflow.dao.show.strategy.IPTrafficStdQueryStrategy;
import com.shine.sourceflow.model.GenericDto;
import com.shine.sourceflow.model.show.ShowGenericDto;
import com.shine.sourceflow.web.show.IPTrafficAction;

/**
 * IP流量
 */
public class IPTrafficDao extends ShowGenericDao {
	public IPTrafficDao() {
		this.queryStrategy = new IPTrafficStdQueryStrategy();
	}
	
	@Override
	public Map<String, DBModel> list(GenericDto dto) {
		Map<String, DBModel> dbModels = new HashMap<String, DBModel>();
		String[] sql = this.createQuerySQL((ShowGenericDto)dto);
		String[] sum = this.createQuerySumSQL((ShowGenericDto)dto);
		if (sql.length > 1 && sql[0] != null && sql[1] != null) {
			// 根据源IP查询数据
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
			
			DecimalFormat perFormat = new DecimalFormat("0.00");
			DecimalFormat bytesTotalFormat = new DecimalFormat("0");
			// 对源IP查询数据进行计算统计
			if (dbModelSrcip.size() > 0) {
				double srcipBytesSum = Double.parseDouble(dbModelSrcipSum.get(0).get("bytes_sum"));
				for (int i = 0; i < dbModelSrcip.size(); i++) {
					double bytesTotal = Double.parseDouble(dbModelSrcip.get(i).get("total_bytes"));
					Double computePer = (bytesTotal / srcipBytesSum) * 100;
					String percentage = perFormat.format(computePer);
					dbModelSrcip.get(i).put("percentage", percentage);
					String formatBytesTotal = bytesTotalFormat.format(bytesTotal / 1048576);
					dbModelSrcip.get(i).put("format_bytes_total", formatBytesTotal);
				}
			}
			// 根据目标IP查询数据
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
			// 对目标IP查询数据进行计算统计
			if (dbModelDstip.size() > 0) {
				double dstipBytesSum = Double.parseDouble(dbModelDstipSum.get(0).get("bytes_sum"));
				for (int i = 0; i < dbModelDstip.size(); i++) {
					double bytesTotal = Double.parseDouble(dbModelDstip.get(i).get("total_bytes"));
					Double computePer = (bytesTotal / dstipBytesSum) * 100;
					String percentage = perFormat.format(computePer);
					dbModelDstip.get(i).put("percentage", percentage);
					String formatBytesTotal = bytesTotalFormat.format(bytesTotal / 1048576);
					dbModelDstip.get(i).put("format_bytes_total", formatBytesTotal);
				}
			}
			
			dbModels.put(IPTrafficAction.IP_SRC, dbModelSrcip);
			dbModels.put(IPTrafficAction.IP_DST, dbModelDstip);
		}
		return dbModels;
	}
}
