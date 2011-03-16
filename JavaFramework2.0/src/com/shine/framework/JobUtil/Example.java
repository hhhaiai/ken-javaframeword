package com.shine.framework.JobUtil;

import com.shine.framework.JobUtil.model.DeleteDataJob;
import com.shine.framework.JobUtil.model.GarbageCollect;

public class Example {

	/**
	 * regesit job
	 * @param args
	 */
	public static void main(String[] args) {
		QuartzSchedulerFactory.getFactory().register(new GarbageCollect());
		QuartzSchedulerFactory.getFactory().register(new DeleteDataJob());
	}

}
