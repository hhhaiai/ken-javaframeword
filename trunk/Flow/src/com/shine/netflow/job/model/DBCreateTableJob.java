package com.shine.netflow.job.model;

import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.List;

import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.quartz.Trigger;
import org.quartz.TriggerUtils;

import com.shine.framework.JobUtil.model.QuartzJob;
import com.shine.framework.Udp.UdpManager;
import com.shine.netflow.job.DBJobAdapter;

/**
 * 每天定时生成数据表的计划任务
 */
public class DBCreateTableJob implements QuartzJob {
	private static final String TRIGGER_NAME = "DBCreateTable";
	private static final int TRIGGER_HOUR = 12;
	private static final int TRIGGER_MINUTE = 01;

	private List<String> tables = new ArrayList<String>();
	private DBJobAdapter dbUtil = new DBJobAdapter();

	public DBCreateTableJob() {
		for (int i = 1; i <= 24; i++) {
			this.tables.add("rawnetflow_hour_"
					+ new DecimalFormat("00").format(i));
		}
	}

	public Trigger createTrigger() {
		Trigger trigger = TriggerUtils.makeDailyTrigger(TRIGGER_HOUR,
				TRIGGER_MINUTE);
		trigger.setName(TRIGGER_NAME);
		return trigger;
	}

	public void execute(JobExecutionContext context)
			throws JobExecutionException {
		// 暂停接收数据包
		UdpManager.getManager().pauseRecevice();

		// TODO 记录日志
		// 开始任务调度
		System.out.println("开始任务调度。。。");
		this.createTable();
		this.stroeData();
		this.truncateDate();

		// 重新启动接收数据包
		UdpManager.getManager().resumeRecevice();
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
