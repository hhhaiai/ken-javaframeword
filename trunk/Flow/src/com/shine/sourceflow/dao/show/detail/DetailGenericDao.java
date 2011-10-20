package com.shine.sourceflow.dao.show.detail;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

import com.shine.DBUtil.DBUtil;
import com.shine.DBUtil.model.DBModel;
import com.shine.sourceflow.dao.GenericDao;
import com.shine.sourceflow.dao.show.detail.strategy.IDetailQueryStrategy;
import com.shine.sourceflow.model.GenericDto;
import com.shine.sourceflow.model.show.detail.DetailGenericDto;
import com.shine.sourceflow.web.GenericAction;

public class DetailGenericDao extends GenericDao {
	protected IDetailQueryStrategy queryStrategy;
	
	@Override
	public Map<String, DBModel> list(GenericDto dto) {
		Map<String, DBModel> dbModels = new HashMap<String, DBModel>();
		DetailGenericDto gdto = (DetailGenericDto)dto;
		String sql = this.createQuerySql(gdto);
		String count = this.createQueryCountSql(gdto);
		// 查询IP
		if (sql != null) {
			DBModel dbModel =
				DBUtil.getInstance().executeQuery(GenericDao.JNDI_DEFAULT, sql);
			try {
				dbModel.next();
			} catch (SQLException e) {
				e.printStackTrace();
			} finally {
				dbModel.close();
			}
			dbModels.put(GenericAction.DATA_DEFAULT, dbModel);
		}
		// 查询总页数
		DBModel dbModelCount =
			DBUtil.getInstance().executeQuery(GenericDao.JNDI_DEFAULT, count);
		try {
			dbModelCount.next();
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			dbModelCount.close();
		}
		String totalRecord = dbModelCount.get(0).get("total_record") == null ?
				"0" : dbModelCount.get(0).get("total_record");
		gdto.setTotalPage((int)Math.ceil(Double.parseDouble(totalRecord) / DetailGenericDto.PAGE_LIMIT));
		return dbModels;
	}
	
	protected String createQuerySql(DetailGenericDto dto) {
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
	
	protected String createQueryCountSql(DetailGenericDto dto) {
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
