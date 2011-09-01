package com.shine.sourceflow.dao.show.strategy;

import com.shine.sourceflow.model.show.ShowGenericDto;

/**
 * 查询策略，运用不同的查询策略来加快数据库查询
 */
public interface IQueryStrategy {
	/**
	 * 创建按月查询语句
	 */
	public String[] createMonthlyQuerySQL(ShowGenericDto dto);
	
	/**
	 * 创建按月查询总记录数语句
	 */
	public String[] createMonthlySumSQL(ShowGenericDto dto);
	
	/**
	 * 创建按周查询语句
	 */
	public String[] createWeeklyQuerySQL(ShowGenericDto dto);
	
	/**
	 * 创建按周查询总记录数语句
	 */
	public String[] createWeeklySumSQL(ShowGenericDto dto);
	
	/**
	 * 创建按天查询语句
	 */
	public String[] createDailyQuerySQL(ShowGenericDto dto);
	
	/**
	 * 创建按天查询总记录数语句
	 */
	public String[] createDailySumSQL(ShowGenericDto dto);
	
	/**
	 * 创建按时查询语句
	 */
	public String[] createHourlyQuerySQL(ShowGenericDto dto);
	
	/**
	 * 创建按时查询总记录数语句
	 */
	public String[] createHourlySumSQL(ShowGenericDto dto);
}
