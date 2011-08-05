package com.shine.netflow.job;

import com.shine.framework.JobUtil.QuartzSchedulerFactory;
import com.shine.netflow.job.model.DBCreateTableJob;

/**
 * 任务调度管理工具类
 */
public class JobUtil {
	private static JobUtil jobUtil = null;

	private JobUtil() {

	}

	public static JobUtil getInstance() {
		if (jobUtil == null) {
			jobUtil = new JobUtil();
		}
		return jobUtil;
	}

	public void init() {
		QuartzSchedulerFactory.getFactory().register(new DBCreateTableJob());
		QuartzSchedulerFactory.getFactory().start();
	}
}
