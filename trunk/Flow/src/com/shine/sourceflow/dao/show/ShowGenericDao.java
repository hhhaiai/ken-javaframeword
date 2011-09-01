package com.shine.sourceflow.dao.show;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

import com.shine.DBUtil.DBUtil;
import com.shine.DBUtil.model.DBModel;
import com.shine.sourceflow.dao.GenericDao;
import com.shine.sourceflow.dao.show.strategy.IQueryStrategy;
import com.shine.sourceflow.model.GenericDto;
import com.shine.sourceflow.model.show.ShowGenericDto;
import com.shine.sourceflow.web.GenericAction;

public abstract class ShowGenericDao extends GenericDao {
	protected IQueryStrategy queryStrategy;
	
	@Override
	public Map<String, DBModel> list(GenericDto dto) {
		Map<String, DBModel> dbModels = new HashMap<String, DBModel>();
		String[] sql = this.createQuerySQL((ShowGenericDto)dto);
		if (sql.length > 0 && sql[0] != null) {
			DBModel dbModel =
				DBUtil.getInstance().executeQuery(GenericDao.JNDI_MONETDB, sql[0]);
			try {
				dbModel.next();
			} catch (SQLException e) {
				e.printStackTrace();
			}
			dbModel.close();
			dbModels.put(GenericAction.DATA_DEFAULT, dbModel);
		}
		return dbModels;
	}
	
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
	
	protected String[] createQuerySumSQL(ShowGenericDto dto) {
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
