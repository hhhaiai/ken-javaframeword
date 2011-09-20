package com.shine.sourceflow.dao.show.detail.strategy;

import com.shine.sourceflow.model.show.detail.DetailGenericDto;

public interface IDetailQueryStrategy {
	public String createHourlyQuerySQL(DetailGenericDto dto);
	
	public String createDailyQuerySQL(DetailGenericDto dto);
	
	public String createWeeklyQuerySQL(DetailGenericDto dto);
	
	public String createMonthlyQuerySQL(DetailGenericDto dto);
	
	public String createHourlyCountSQL(DetailGenericDto dto);
	
	public String createDailyCountSQL(DetailGenericDto dto);
	
	public String createWeeklyCountSQL(DetailGenericDto dto);
	
	public String createMonthlyCountSQL(DetailGenericDto dto);
}
