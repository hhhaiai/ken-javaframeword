package com.shine.framework.JobUtil.model;

import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.quartz.Trigger;
import org.quartz.TriggerUtils;

public class DeleteDataJob implements QuartzJob {

	@Override
	public Trigger createTrigger() {
		Trigger trigger = TriggerUtils.makeDailyTrigger(0, 0);
		trigger.setName("DeleteData");
		return trigger;
	}

	@Override
	public void execute(JobExecutionContext arg0) throws JobExecutionException {
		// TODO Auto-generated method stub

	}

}
