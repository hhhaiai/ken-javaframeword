package com.shine.sourceflow.dao.show;

import com.shine.sourceflow.dao.show.strategy.IPTrafficStdQueryStrategy;
import com.shine.sourceflow.dao.show.strategy.IQueryStrategy;
import com.shine.sourceflow.model.show.GenericDTO;

/**
 * IP流量
 */
public class IPTrafficDao extends GenericDao {
	private IQueryStrategy queryStrategy = new IPTrafficStdQueryStrategy();
	
	/**
	 * 创建SQL查询语句
	 * 
	 * @param dto
	 * @return
	 */
	@Override
	public String createQuerySQL(GenericDTO dto) {
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
