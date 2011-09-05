package com.shine.sourceflow.dao.show;

import java.sql.SQLException;
import java.text.DecimalFormat;
import java.util.HashMap;
import java.util.Map;

import com.shine.DBUtil.DBUtil;
import com.shine.DBUtil.model.DBModel;
import com.shine.sourceflow.dao.GenericDao;
import com.shine.sourceflow.dao.show.strategy.IQueryStrategy;
import com.shine.sourceflow.model.GenericDto;
import com.shine.sourceflow.model.show.ShowGenericDto;

public abstract class ShowGenericDao extends GenericDao {
	protected IQueryStrategy queryStrategy;
	
	@Override
	public Map<String, DBModel> list(GenericDto dto) {
		Map<String, DBModel> dbModels = new HashMap<String, DBModel>();
		String[] sql = this.createQuerySQL((ShowGenericDto)dto);
		String sum = this.createQuerySumSQL((ShowGenericDto)dto);
		if (sql.length > 1 && sql[0] != null && sql[1] != null) {
			// 根据源IP查询数据
			DBModel dbModelSrcip =
				DBUtil.getInstance().executeQuery(GenericDao.JNDI_MONETDB, sql[0]);
			try {
				dbModelSrcip.next();
			} catch (SQLException e) {
				e.printStackTrace();
			} finally {
				dbModelSrcip.close();
			}
			// 根据目标IP查询数据
			DBModel dbModelDstip = 
				DBUtil.getInstance().executeQuery(GenericDao.JNDI_MONETDB, sql[1]);
			try {
				dbModelDstip.next();
			} catch (SQLException e) {
				e.printStackTrace();
			} finally {
				dbModelDstip.close();
			}
			// 查询总流量
			DBModel dbModelSum =
				DBUtil.getInstance().executeQuery(GenericDao.JNDI_MONETDB, sum);
			try {
				dbModelSum.next();
			} catch (SQLException e) {
				e.printStackTrace();
			} finally {
				dbModelSum.close();
			}
			DecimalFormat perFormat = new DecimalFormat("0.00");
			DecimalFormat bytesFormat = new DecimalFormat("0");
			double bytesSum = Double.parseDouble(dbModelSum.get(0).get("bytes_sum"));
			// 对查询数据进行统计
			this.handleModel(dbModels, dbModelSrcip, dbModelDstip, perFormat, bytesFormat, bytesSum);
		}
		return dbModels;
	}
	
	/**
	 * 对查询数据进行统计
	 */
	public abstract void handleModel(
			Map<String, DBModel> dbModels, DBModel srcDBModel, 
			DBModel dstDBModel, DecimalFormat perFormat, 
			DecimalFormat bytesFormat, double bytesSum);
	
	/**
	 * 根据不同策略创建查询语句
	 * 
	 * @param dto
	 * @return
	 */
	protected String[] createQuerySQL(ShowGenericDto dto) {
		int statPeriod = dto.getStatPeroid();
		switch(statPeriod) {
		case 1:
			return this.queryStrategy.createDailyQuerySQL(dto);
		case 2:
			return this.queryStrategy.createWeeklyQuerySQL(dto);
		case 3:
			return this.queryStrategy.createMonthlyQuerySQL(dto);
		case 4:
			return this.queryStrategy.createHourlyQuerySQL(dto);
		}
		return null;
	}
	
	/**
	 * 根据不同策略创建查询总记录语句
	 * 
	 * @param dto
	 * @return
	 */
	protected String createQuerySumSQL(ShowGenericDto dto) {
		int statPeriod = dto.getStatPeroid();
		switch(statPeriod) {
		case 1:
			return this.queryStrategy.createDailySumSQL(dto);
		case 2:
			return this.queryStrategy.createWeeklySumSQL(dto);
		case 3:
			return this.queryStrategy.createMonthlySumSQL(dto);
		case 4:
			return this.queryStrategy.createHourlySumSQL(dto);
		}
		return null;
	}
}
