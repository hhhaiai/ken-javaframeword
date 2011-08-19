package com.shine.netflow.job.model;

import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.quartz.Trigger;
import org.quartz.TriggerUtils;

import com.shine.framework.JobUtil.model.QuartzJob;
import com.shine.netflow.job.dao.CreateImmediateTableDao;

public class CreateImmediateTableJob implements QuartzJob {
	private static final String TRIGGER_NAME = "DBCreateImmediateTable";
	private static final int TRIGGER_REPEAT_COUNT = 0;
	private static final int TRIGGER_REPEAT_INTERVAL = 1;
	
	private CreateImmediateTableDao dao = new CreateImmediateTableDao();

	@Override
	public Trigger createTrigger() {
		Trigger trigger = TriggerUtils.makeImmediateTrigger(
				TRIGGER_REPEAT_COUNT, TRIGGER_REPEAT_INTERVAL);
		trigger.setName(TRIGGER_NAME);
		return trigger;
	}

	@Override
	public void execute(JobExecutionContext arg0) throws JobExecutionException {
		// TODO 记录日志
		// 开始任务调度
		System.out.println("立即任务调度...");
		this.createTable();
	}
	
	/**
	 * 创建表
	 */
	private void createTable() {
		this.dao.createTable();
	}
}
