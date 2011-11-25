package com.shine.netflow.job.model;

import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.quartz.Trigger;
import org.quartz.TriggerUtils;

import com.shine.framework.JobUtil.model.QuartzJob;

/**
 * 每天定时生成数据表的计划任务
 */
public class CreateDailyTableJob implements QuartzJob {
	private static final String TRIGGER_NAME = "DBCreateTable";
	private static final int TRIGGER_HOUR = 0;
	private static final int TRIGGER_MINUTE = 1;

	public CreateDailyTableJob() {
	}

	public Trigger createTrigger() {
		Trigger trigger = TriggerUtils.makeDailyTrigger(TRIGGER_HOUR,
				TRIGGER_MINUTE);
		trigger.setName(TRIGGER_NAME);
		return trigger;
	}

	public void execute(JobExecutionContext context)
			throws JobExecutionException {
		
	}
}
