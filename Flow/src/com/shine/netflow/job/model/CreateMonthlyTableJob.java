package com.shine.netflow.job.model;

import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.quartz.Trigger;
import org.quartz.TriggerUtils;

import com.shine.framework.JobUtil.model.QuartzJob;
import com.shine.netflow.job.dao.CreateMonthlyTableDao;

public class CreateMonthlyTableJob implements QuartzJob {
	private static final String TRIGGER_NAME = "DBCreateMonthlyTable";
	private static final int TRIGGER_DATOFMONTH = 1;
	private static final int TRIGGER_HOUR = 0;
	private static final int TRIGGER_MINUTE = 0;
	
	private CreateMonthlyTableDao dao = new CreateMonthlyTableDao();

	@Override
	public Trigger createTrigger() {
		Trigger trigger = TriggerUtils.makeMonthlyTrigger(TRIGGER_DATOFMONTH,
				TRIGGER_HOUR, TRIGGER_MINUTE);
		trigger.setName(TRIGGER_NAME);
		return trigger;
	}

	@Override
	public void execute(JobExecutionContext arg0) throws JobExecutionException {
		// TODO 记录日志
		// 开始任务调度
		System.out.println("每月任务调度...");
		this.createTable();
	}
	
	/**
	 * 创建表
	 */
	private void createTable() {
		this.dao.createTable();
	}
}
