package com.shine.framework.JobUtil;

import java.util.ArrayList;
import java.util.List;

import org.quartz.JobDetail;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.SchedulerFactory;
import org.quartz.impl.StdSchedulerFactory;

import com.shine.framework.JobUtil.model.QuartzJob;

public final class QuartzSchedulerFactory {
	private static QuartzSchedulerFactory qzf = new QuartzSchedulerFactory();
	private final Scheduler scheduler;
	private boolean started;
	private final List<QuartzJob> jobs;

	public static QuartzSchedulerFactory getFactory() {
		return qzf;
	}

	private QuartzSchedulerFactory() {
		try {
			SchedulerFactory factory = new StdSchedulerFactory();
			scheduler = factory.getScheduler();
		} catch (SchedulerException e) {
			throw new IllegalStateException("Can not create QuartzScheduler...");
		}
		jobs = new ArrayList<QuartzJob>();

//		register(new GarbageCollect());
//		register(new DeleteDataJob());
	}

	public void register(QuartzJob qj) {
		if (getJob(qj.getClass()) != null)
			throw new IllegalStateException(qj.getClass() + " already exist.");

		try {
			JobDetail jobDetail = new JobDetail(qj.getClass().getSimpleName(),
					Scheduler.DEFAULT_GROUP, qj.getClass());
			scheduler.scheduleJob(jobDetail, qj.createTrigger());

			jobs.add(qj);
		} catch (SchedulerException e) {
			throw new IllegalStateException(e.getMessage());
		}
	}

	public void start() {
		if (started)
			return;

		try {
			scheduler.start();
			started = true;
		} catch (SchedulerException e) {
			e.printStackTrace();
		}
	}
	
	public void remove(QuartzJob qj){
		try {
			String jobName = qj.getClass().getSimpleName();
			String groupName = Scheduler.DEFAULT_GROUP;
			scheduler.pauseTrigger(jobName, groupName);
			scheduler.unscheduleJob(jobName, groupName);
			scheduler.deleteJob(jobName, groupName);
			jobs.remove(qj);
		} catch (SchedulerException e) {
			e.printStackTrace();
		}
	}

	public void shutdown() {
		try {
			scheduler.shutdown();
		} catch (SchedulerException e) {
			e.printStackTrace();
		}
	}

	public QuartzJob getJob(Class<? extends QuartzJob> clazz) {
		for (QuartzJob qj : jobs) {
			if (qj.getClass() == clazz)
				return qj;
		}
		return null;
	}
}
