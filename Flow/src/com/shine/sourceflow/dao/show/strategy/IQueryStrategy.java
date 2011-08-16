package com.shine.sourceflow.dao.show.strategy;

import com.shine.sourceflow.model.show.GenericDTO;

/**
 * 查询策略
 */
public interface IQueryStrategy {
	/**
	 * 创建按月查询语句
	 */
	public String createMonthlyQuerySQL(GenericDTO dto);
	
	/**
	 * 创建按月周查询语句
	 */
	public String createWeeklyQuerySQL(GenericDTO dto);
	
	/**
	 * 创建按日查询语句
	 */
	public String createDailyQuerySQL(GenericDTO dto);
	
	/**
	 * 创建按时查询语句
	 */
	public String createHourlyQuerySQL(GenericDTO dto);
}
