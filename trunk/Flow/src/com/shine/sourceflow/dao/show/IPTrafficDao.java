package com.shine.sourceflow.dao.show;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

import com.shine.DBUtil.DBUtil;
import com.shine.DBUtil.model.DBModel;
import com.shine.sourceflow.dao.show.strategy.IPTrafficStdQueryStrategy;
import com.shine.sourceflow.dao.show.strategy.IQueryStrategy;
import com.shine.sourceflow.model.show.GenericDTO;
import com.shine.sourceflow.web.show.IPTrafficAction;

/**
 * IP流量
 */
public class IPTrafficDao extends GenericDao {
	private IQueryStrategy queryStrategy = new IPTrafficStdQueryStrategy();
	
	public Map<String, DBModel> query(GenericDTO dto) {
		Map<String, DBModel> dbModels = new HashMap<String, DBModel>();
		String[] sql = this.createQuerySQL(dto);
		if (sql.length > 1 && sql[0] != null && sql[1] != null) {
			DBModel dbModelSrcip =
				DBUtil.getInstance().executeQuery(GenericDao.JNDI, sql[0]);
			try {
				dbModelSrcip.next();
			} catch (SQLException e) {
				e.printStackTrace();
			}
			dbModelSrcip.close();
			DBModel dbModelDstip = 
				DBUtil.getInstance().executeQuery(GenericDao.JNDI, sql[1]);
			try {
				dbModelDstip.next();
			} catch (SQLException e) {
				e.printStackTrace();
			}
			dbModelDstip.close();
			dbModels.put(IPTrafficAction.IP_SRC, dbModelSrcip);
			dbModels.put(IPTrafficAction.IP_DST, dbModelDstip);
		}
		return dbModels;
	}
	
	/**
	 * 创建SQL查询语句
	 * 
	 * @param dto
	 * @return
	 */
	@Override
	public String[] createQuerySQL(GenericDTO dto) {
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
}
