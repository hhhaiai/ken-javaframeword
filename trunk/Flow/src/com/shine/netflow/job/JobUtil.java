package com.shine.netflow.job;

import com.shine.framework.JobUtil.QuartzSchedulerFactory;
import com.shine.netflow.model.DBCreateTableJob;

/**
 * 任务调度管理工具类
 */
public class JobUtil {
	private static JobUtil jobUtil = new JobUtil();
	
	private JobUtil() {
		
	}
	
	public static JobUtil getInstance() {
		return jobUtil;
	}
	
	public void init() {
		QuartzSchedulerFactory.getFactory().register(new DBCreateTableJob());
		QuartzSchedulerFactory.getFactory().start();
	}
}
