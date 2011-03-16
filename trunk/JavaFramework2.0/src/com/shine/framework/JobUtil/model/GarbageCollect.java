package com.shine.framework.JobUtil.model;

import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.quartz.Trigger;
import org.quartz.TriggerUtils;

public class GarbageCollect implements QuartzJob {

	@Override
	public Trigger createTrigger() {
		Trigger trigger = TriggerUtils.makeHourlyTrigger();
		trigger.setName("GarbageCollect");
		return trigger;
	}

	@Override
	public void execute(JobExecutionContext arg0) throws JobExecutionException {
		Runtime.getRuntime().gc();
	}

}
