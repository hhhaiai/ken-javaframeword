package com.shine.sourceflow.dao.show.trend;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;
import java.util.TreeMap;

import com.shine.DBUtil.DBUtil;
import com.shine.DBUtil.model.DBModel;
import com.shine.sourceflow.dao.GenericDao;
import com.shine.sourceflow.dao.show.trend.strategy.ITrendQueryStrategy;
import com.shine.sourceflow.model.GenericDto;
import com.shine.sourceflow.model.show.trend.TrendGenericDto;

public abstract class TrendGenericDao extends GenericDao {
	protected ITrendQueryStrategy queryStrategy;
	
	@Override
	public Map<String, DBModel> list(GenericDto dto) {
		Map<String, DBModel> dbSrcModels = new TreeMap<String, DBModel>();
		Map<String, DBModel> dbDstModels = new TreeMap<String, DBModel>();
		Map<String, String[]> sqls = this.createQuerySQL((TrendGenericDto)dto);
		for (Map.Entry<String, String[]> entry : sqls.entrySet()) {
			if (entry.getValue().length > 0) {
				String sql = entry.getValue()[0];
				DBModel dbModel = DBUtil.getInstance().
					executeQuery(GenericDao.JNDI_DEFAULT, sql);
				try {
					dbModel.next();
				} catch (SQLException e) {
					e.printStackTrace();
				} finally {
					dbModel.close();
				}
				dbSrcModels.put(entry.getKey(), dbModel);
			}
			if (entry.getValue().length > 1) {
				DBModel dbModel = DBUtil.getInstance().
					executeQuery(GenericDao.JNDI_DEFAULT, entry.getValue()[1]);
				try {
					dbModel.next();
				} catch (SQLException e) {
					e.printStackTrace();
				} finally {
					dbModel.close();
				}
				dbDstModels.put(entry.getKey(), dbModel);
			}
		}
		return this.handleDbModels(dbSrcModels, dbDstModels);
	}
	
	protected abstract Map<String, DBModel> handleDbModels(Map<String, DBModel> dbSrcModels,
			Map<String, DBModel> dbDstModels);
	
	/**
	 * 根据不同策略创建查询语句
	 * 
	 * @param dto
	 * @return
	 */
	protected Map<String, String[]> createQuerySQL(TrendGenericDto dto) {
		int statPeriod = dto.getStatPeroid();
		switch(statPeriod) {
		case 1:
			return this.queryStrategy.createDailyCountSQL(dto);
		case 2:
			return this.queryStrategy.createWeeklyCountSQL(dto);
		case 3:
			return this.queryStrategy.createMonthlyCountSQL(dto);
		case 4:
			return this.queryStrategy.createHourlyCountSQL(dto);
		}
		return null;
	}
}
