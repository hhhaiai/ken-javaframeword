package com.shine.sourceflow.dao.show.trend.strategy;

import java.util.Map;

import com.shine.sourceflow.model.show.trend.TrendGenericDto;

public interface ITrendQueryStrategy {
	public Map<String, String[]> createHourlyCountSQL(TrendGenericDto dto);
	
	public Map<String, String[]> createDailyCountSQL(TrendGenericDto dto);
	
	public Map<String, String[]> createWeeklyCountSQL(TrendGenericDto dto);
	
	public Map<String, String[]> createMonthlyCountSQL(TrendGenericDto dto);
}
