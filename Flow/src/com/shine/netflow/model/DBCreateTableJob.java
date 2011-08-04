package com.shine.netflow.model;

import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.List;

import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.quartz.Trigger;
import org.quartz.TriggerUtils;

import com.shine.framework.JobUtil.model.QuartzJob;
import com.shine.netflow.job.DBJobAdapter;

/**
 * 每天定时生成数据表的计划任务
 */
public class DBCreateTableJob implements QuartzJob {
	private static final String TRIGGER_NAME = "DBCreateTable";
	private static final int TRIGGER_HOUR = 13;
	private static final int TRIGGER_MINUTE = 00;
	
	private List<String> tables = new ArrayList<String>();
	private DBJobAdapter dbUtil = new DBJobAdapter();
	
	public DBCreateTableJob() {
		for (int i = 1; i <= 24; i++) {
			this.tables.add("rawnetflow_hour_" + new DecimalFormat("00").format(i));
		}
	}
	
	public Trigger createTrigger() {
		Trigger trigger = TriggerUtils.makeDailyTrigger(TRIGGER_HOUR, TRIGGER_MINUTE);
//		Trigger trigger = TriggerUtils.makeSecondlyTrigger(1);
		trigger.setName(TRIGGER_NAME);
		return trigger;
	}

	public void execute(JobExecutionContext context)
			throws JobExecutionException {
		// TODO 记录日志
		System.out.println("开始任务调度。。。");
		Long startTime = System.currentTimeMillis();
		this.createTable();
		this.stroeData();
		this.truncateDate();
		Long endTime = System.currentTimeMillis();
		System.out.println("执行时间" + (endTime - startTime));
	}
	
	/**
	 * 创建表
	 */
	private void createTable() {
		this.dbUtil.createTable();
	}
	
	/**
	 * 存储数据
	 */
	private void stroeData() {
		// 遍历所有的数据表
		for (String table : this.tables) {
			this.dbUtil.saveData(table);
		}
	}
	
	/**
	 * 清空旧数据
	 */
	private void truncateDate() {
		// 遍历所有的数据表
		for (String table : this.tables) {
			this.dbUtil.truncateDate(table);
		}
	}
}
