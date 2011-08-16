package com.shine.sourceflow.dao.show.strategy;

import com.shine.framework.core.util.DateUtil;
import com.shine.sourceflow.model.show.GenericDTO;

/**
 * IP流量标准查询策略
 */
public class IPTrafficStdQueryStrategy implements IQueryStrategy {
	@Override
	public String createDailyQuerySQL(GenericDTO dto) {
		if (this.isToday(dto.getDate())) {
			
		}
		return null;
	}

	@Override
	public String createHourlyQuerySQL(GenericDTO dto) {
		// TODO Auto-generated method stub
		return "";
	}

	@Override
	public String createMonthlyQuerySQL(GenericDTO dto) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String createWeeklyQuerySQL(GenericDTO dto) {
		// TODO Auto-generated method stub
		return null;
	}
	
	/**
	 * 判断日期是否为今天
	 * 
	 * @param date
	 * @return
	 */
	private boolean isToday(String date) {
		return date.equals(DateUtil.getCurrentDate());
	}
}
