package com.shine.framework.JobUtil.model;

import org.quartz.Job;
import org.quartz.Trigger;

public interface QuartzJob extends Job {
	public Trigger createTrigger();
}
